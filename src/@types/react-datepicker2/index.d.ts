declare module 'react-datepicker2' {
    // const value: string;
    // export = value;
  
    interface IProps {
      onchange?: (timeStamp: number) => void;
      isGregorian?: boolean;
      timePicker?: boolean;
      disabled?: boolean;
      min?: number;
      max?: number;
      ranges?: {}[];
      inputFormat?: string;
      inputJalaaliFormat?: string;
      value: any;
    }
  
    export default class DatePicker<any> extends React.Component<any>{ }
  
  }