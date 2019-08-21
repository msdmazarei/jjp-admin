import React from "react";
import { Localization } from "../../config/localization/localization";


class Dashboard extends React.Component {


  render() {
    // const files = this.state.files.map((file: any) => (
    //   <li key={file.name}>
    //     {file.name} - {file.size} bytes
    //   </li>
    // ))
    return (
      <div className="content">
        <div className="row">
          <div className="col-12">
            <h2>{Localization.dashboard}</h2>
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;