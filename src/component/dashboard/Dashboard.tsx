import React from "react";
import { Localization } from "../../config/localization/localization";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Brush, ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import { TInternationalization } from "../../config/setup";
import { IToken } from "../../model/model.token";

export interface IProps {
  history: History;
  internationalization: TInternationalization;
  token: IToken;
}

interface IState {
  loader: boolean;
  num: number;
}

class Dashboard extends React.Component<IProps, IState> {
  state = {
    loader: true,
    num: 10000,
  }

  // constructor(props: IProps) {
  //   super(props);
  // }


  resTrue() {
    if (this.state.loader) {
      this.setState({
        ...this.state,
        loader: false,
      })
    }
    else {
      this.setState({
        ...this.state,
        loader: true,
      })
    }
  }

  resize(): number {
    return 50;
  }

  private pie_wrapper: any;
  calc_pie_width(): number {
    // debugger;
    if (this.pie_wrapper) {
      // this.pie_wrapper
      return this.pie_wrapper.offsetWidth;
    }
    return 200;
  }

  render() {
    const data = [
      {
        name: 'ali', uv: this.state.num, pv: 6000, amt: 2400,
      },
      {
        name: 'hamid', uv: 3000, pv: 1398, amt: 2210,
      },
      {
        name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
      },
      {
        name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
      },
      {
        name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
      },
      {
        name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
      },
      {
        name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
      },
    ];
    const data01 = [
      { name: 'Group A', value: 400 }, { name: 'Group B', value: 300 },
      { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 },
    ];
    const data02 = [
      { name: 'A1', value: 100 },
      { name: 'A2', value: 300 },
      { name: 'B1', value: 100 },
      { name: 'B2', value: 80 },
      { name: 'B3', value: 40 },
      { name: 'B4', value: 30 },
      { name: 'B5', value: 50 },
      { name: 'C1', value: 100 },
      { name: 'C2', value: 200 },
      { name: 'D1', value: 150 },
      { name: 'D2', value: 50 },
    ];
    const data3 = [
      { name: '1', uv: 300, pv: 456 },
      { name: '2', uv: -145, pv: 230 },
      { name: '3', uv: -100, pv: 345 },
      { name: '4', uv: -8, pv: 450 },
      { name: '5', uv: 100, pv: 321 },
      { name: '6', uv: 9, pv: 235 },
      { name: '7', uv: 53, pv: 267 },
      { name: '8', uv: 252, pv: -378 },
      { name: '9', uv: 79, pv: -210 },
      { name: '10', uv: 294, pv: -23 },
      { name: '12', uv: 43, pv: 45 },
      { name: '13', uv: -74, pv: 90 },
      { name: '14', uv: -71, pv: 130 },
      { name: '15', uv: -117, pv: 11 },
      { name: '16', uv: -186, pv: 107 },
      { name: '17', uv: -16, pv: 926 },
      { name: '18', uv: -125, pv: 653 },
      { name: '19', uv: 222, pv: 366 },
      { name: '20', uv: 372, pv: 486 },
      { name: '21', uv: 182, pv: 512 },
      { name: '22', uv: 164, pv: 302 },
      { name: '23', uv: 316, pv: 425 },
      { name: '24', uv: 131, pv: 467 },
      { name: '25', uv: 291, pv: -190 },
      { name: '26', uv: -47, pv: 194 },
      { name: '27', uv: -415, pv: 371 },
      { name: '28', uv: -182, pv: 376 },
      { name: '29', uv: -93, pv: 295 },
      { name: '30', uv: -99, pv: 322 },
      { name: '31', uv: -52, pv: 246 },
      { name: '32', uv: 154, pv: 33 },
      { name: '33', uv: 205, pv: 354 },
      { name: '34', uv: 70, pv: 258 },
      { name: '35', uv: -25, pv: 359 },
      { name: '36', uv: -59, pv: 192 },
      { name: '37', uv: -63, pv: 464 },
      { name: '38', uv: -91, pv: -2 },
      { name: '39', uv: -66, pv: 154 },
      { name: '47', uv: -50, pv: 186 },
    ];

    // const files = this.state.files.map((file: any) => (
    //   <li key={file.name}>
    //     {file.name} - {file.size} bytes
    //   </li>
    // ))
    return (
      <div className="content">
        <div className="row">
          <div className="col-12 ">
            <h2>{Localization.dashboard}</h2>
            <div className="row">
              <div className="col-12 col-md-6 text-center">
                {
                  this.state.loader
                    ?
                    <i className="fa fa-spinner fa-3x fa-spin mt-5"></i>
                    :
                    <ResponsiveContainer width="100%" height={500}>
                    <BarChart width={750} height={450} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5, }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="pv" fill="#8884d8" />
                      <Bar dataKey="uv" fill="#82ca9d" />
                      <Legend />
                    </BarChart>
                    </ResponsiveContainer>
                }
              </div>
              <div className="col-12 col-md-6 text-center" ref={r => this.pie_wrapper = r}>
                {
                  this.state.loader
                    ?
                    <i className="fa fa-spinner fa-3x fa-spin"></i>
                    :
                    <ResponsiveContainer width="100%" height={500}>
                      <PieChart>
                        <Pie data={data01} dataKey="value"  outerRadius={60} fill="#8884d8" />
                        <Pie data={data02} dataKey="value"  innerRadius={90} outerRadius={120} fill="#82ca9d" label />
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                }
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {
                  this.state.loader
                    ?
                    <i className="fa fa-spinner fa-3x fa-spin"></i>
                    :
                    <ResponsiveContainer width="100%" height={500}>
                    <BarChart width={1500} height={700} data={data3} margin={{ top: 5, right: 30, left: 20, bottom: 5, }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                      <ReferenceLine y={0} stroke="#000" />
                      <Brush dataKey="name" height={30} stroke="#8884d8" />
                      <Bar dataKey="pv" fill="#8884d8" />
                      <Bar dataKey="uv" fill="#82ca9d" />
                      <Legend />
                    </BarChart>
                    </ResponsiveContainer>
                }
              </div>
            </div>
            <button
              onClick={() => this.resTrue()}
            >res</button>
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;