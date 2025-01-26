import { TokenSet, User } from "next-auth"
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth"
import { URLSearchParams } from "url"
import { z } from "zod"

export interface XboxProfile extends Record<string, any> {
  gamertag: string
  xuid: string
  email: string
}

const XHTSResponseSchema = z.object({
    Token: z.string(),
    DisplayClaims: z.object({
        xui: z.array(z.object({ gtg: z.string().optional(), xid: z.string().optional() })).length(1),
    }),
})

export default function XboxLive<P extends XboxProfile>(
    options: OAuthUserConfig<P> & {
      /** @default "consumers" */
      tenantId?: string
    }
  ): OAuthConfig<P> {
    const tenant = options.tenantId ?? "consumers"
  
    return {
      id: "xbl",
      name: "Xbox LIVE",
      type: "oauth",
      wellKnown: `https://login.microsoftonline.com/${tenant}/v2.0/.well-known/openid-configuration`,
      authorization: {
        url: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`,
        params: {
          scope: "openid email XboxLive.signin",
        },
      },
      token: {
        async request({params, provider}: { params: Record<string, unknown>, provider: OAuthConfig<P> & {
          signinUrl: string
          callbackUrl: string
        } }) {
          const response = await fetch(
            `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                client_id: options.clientId,
                client_secret: options.clientSecret,
                code: params.code as string,
                grant_type: "authorization_code",
                redirect_uri: provider.callbackUrl,
              })
            }
          )

          const responseJson = await response.json()

          const tokens: TokenSet = {
            access_token: responseJson.access_token,
            id_token: responseJson.id_token,
            refresh_token: responseJson.refresh_token,
            token_type: responseJson.token_type,
            scope: responseJson.scope,
            expires_in: responseJson.expires_in,
          }

          return {tokens}
        }
      },
      userinfo: {
        async request({ tokens }: { tokens: TokenSet }) {
          if (tokens.id_token) {
            const decoded = JSON.parse(
              Buffer.from(tokens.id_token.split(".")[1]!, "base64").toString()
            ) as { email: string }

  
            const xbox = await fetch(
              "https://user.auth.xboxlive.com/user/authenticate",
              {
                method: "POST",
                body: JSON.stringify({
                  Properties: {
                    AuthMethod: "RPS",
                    SiteName: "user.auth.xboxlive.com",
                    RpsTicket: "d=" + tokens.access_token,
                    'OptionalDisplayClaims': ['mgt', 'umg', 'mgs']
                  },
                  RelyingParty: "http://auth.xboxlive.com",
                  TokenType: "JWT",
                }),
              }
            )
  
            if (xbox.ok) {
              const xboxResponse = (await xbox.json()) as {
                DisplayClaims: { xui: { uhs: string | undefined }[] }
                Token: string | undefined
              }
  
              const xboxToken = xboxResponse?.Token

              const xhts = await fetch(
                "https://xsts.auth.xboxlive.com/xsts/authorize",
                {
                  method: "POST",
                  body: JSON.stringify({
                    Properties: {
                        'SandboxId': 'RETAIL',
                        'OptionalDisplayClaims': ['mgt', 'umg', 'mgs'],
                        UserTokens: [xboxToken],
                    },
                    'RelyingParty': 'http://xboxlive.com',
                    'TokenType': 'JWT',
                  }),
                }
              )

              const xhtsResponse = XHTSResponseSchema.parse(await xhts.json())
  
              console.log({xboxResponse: JSON.stringify(xboxResponse.DisplayClaims), xhtsResponse: JSON.stringify(xhtsResponse.DisplayClaims)})

              return {
                gamertag: xhtsResponse.DisplayClaims.xui[0].gtg,
                xuid: xhtsResponse.DisplayClaims.xui[0].xid,
                userHash: xboxResponse.DisplayClaims.xui[0].uhs,
                xboxToken,
                xstsToken: xhtsResponse.Token,
                email: decoded.email,
              }
            }
          }
  
          throw new Error()
        },
      },
      profile(profile: any): User {
        return {
          ...profile,
          id: profile.xuid,
          name: profile.gamertag,
        }
      },
      options,
    }
  }