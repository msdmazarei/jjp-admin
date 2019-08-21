import React from 'react';
import { IPerson } from "../../model/model.person";
import { Table, IProps_table} from "../../component/table/table";
import { UserService } from "../../service/user.service";

//  define props & state and type 

export interface IUser {
  last_name: number;
  username: string;
  id: string;
  person?: IPerson;
}

interface IProps {

}
export interface IUserState {

//   userlist: any[];//IUser
//   colHeaders: any[]//Table header
user_table: IProps_table;
}

// define class of Users

class User extends React.Component<IProps, IUserState>{
  state = {
    user_table:{
      list: [],
      colHeaders: [
          { field: "username", title: "Username" },
          {
              field: "name", title: "Name", templateFunc: () => {
                  return (
                      "Name"
                  )
              }
          },
          { field: "lastname", title: "Last name" },
          { field: "img", title: "Image" },
          { field: "phone", title: "Phone" },
          { field: "email", title: "Email" },
          { field: "address", title: "Address" }
      ],
      actions: [
          { text: <i className="fa fa-trash"></i>, ac_func: this.deleteRow },
          { text: <i className="fa fa-pencil-square-o" data-toggle="modal" data-target="#exampleModal"></i>, ac_func: this.updateRow },
      ]
    }
  }

  deleteRow(row:any) {
      
  }

    
  updateRow(row:any) {
     
  }

  // define axios for give data

  _userService = new UserService();
  
  componentDidMount() {
    this.fetchUsers();
    // this.fetchOneUser('4c64a437-0740-4be9-b836-5453ac93f05d');
  }

  async fetchUsers() {
    let res = await this._userService.search(10,0).catch(error => {
      debugger;
      //notify
    });

    if (res) {
      debugger;
      // const userlist = res.data;
      this.setState({
        ...this.state, user_table: {
          ...this.state.user_table,
          list: res.data
        }
      });
    }
  }
  async fetchOneUser(userId:string){
    // let oneUser  = await this._userService.userById(userId).catch(oneUser=>{debugger})       when want use uncommented this line
  }

//   componentDidMount() {
//       axios.get(`http://www.json-generator.com/api/json/get/caItVVIwXS?indent=2`)
//           .then(res => {
//               const userlist = res.data;
//               this.setState({ userlist });
//           })
//   }
  
  //   call Table component

render() {
    return (
        <div className="content">
            <div className="row">
                <div className="col-12">
                    <Table list={this.state.user_table.list} colHeaders={this.state.user_table.colHeaders} actions={this.state.user_table.actions}></Table>
                </div>
            </div>
        </div>
    );
}
}

export default User
  