import * as recharts from 'recharts';

declare module 'recharts' {
  import { CategoricalChartWrapper, EventAttributes } from 'recharts';

  type FunnelChartProps = CategoricalChartWrapper & EventAttributes;
  export class FunnelChart extends React.Component<FunnelChartProps> { }

  // export interface FunnelProps extends EventAttributes, Partial<PresentationAttributes>, Animatable {
  interface FunnelProps extends EventAttributes, Partial<PresentationAttributes> {
    data?: any; // DataKey;
    dataKey?: String | Number | Function;
    nameKey?: string;
    legendType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye' | 'none';
    activeShape?: Object | ReactElement | Function;
    trapezoids?: Array;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    id?: string;
  }
  export class Funnel extends React.Component<FunnelProps> { }
}
