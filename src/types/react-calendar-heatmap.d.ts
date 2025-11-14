declare module 'react-calendar-heatmap' {
  import { Component } from 'react';

  export interface CalendarHeatmapValue {
    date: string;
    count: number;
  }

  export interface CalendarHeatmapProps {
    startDate: Date;
    endDate: Date;
    values: CalendarHeatmapValue[];
    classForValue?: (value: CalendarHeatmapValue | null) => string;
    tooltipDataAttrs?: (value: CalendarHeatmapValue | null) => Record<string, string>;
    onClick?: (value: CalendarHeatmapValue | null) => void;
    onMouseOver?: (e: React.MouseEvent, value: CalendarHeatmapValue | null) => void;
    onMouseLeave?: (e: React.MouseEvent, value: CalendarHeatmapValue | null) => void;
    showWeekdayLabels?: boolean;
    showMonthLabels?: boolean;
    showOutOfRangeDays?: boolean;
    horizontal?: boolean;
    gutterSize?: number;
    squareSize?: number;
    titleForValue?: (value: CalendarHeatmapValue | null) => string;
    transformDayElement?: (rect: React.ReactElement, value: CalendarHeatmapValue | null, index: number) => React.ReactElement;
  }

  export default class CalendarHeatmap extends Component<CalendarHeatmapProps> {}
}

