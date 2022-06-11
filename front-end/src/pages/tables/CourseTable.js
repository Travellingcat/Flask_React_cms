import React, { Component } from "react";
import {Table, Space, Button, message} from 'antd';
import "antd/dist/antd.css";
import HttpUtil from "../../Utils/HttpUtil";
import ApiUtil from "../../Utils/ApiUtil";
import CourseUpdateDialog from "../dialogs/CourseUpdateDialog";
import CourseAddDialog from "../dialogs/CourseAddDialog";
import CourseDelDialog from "../dialogs/CourseDelDialog";


class CourseTable extends Component {

  state = {
    showUpdateDialog: false,
    edit_record: {},
    current_columns: [],
    my_data: [],
    my_data2: [],
    selected_c_ids: [],
    showAddCourse: false,
    showDelCourse: false,
  }

  columns = [
    {
      title: '课程编号',
      dataIndex: 'c_id',
      width: "150px",
    },
      {
      title: '课程名',
      dataIndex: 'c_name',
        width: "180px",
    },
    {
      title: '授课教师',
      dataIndex: 'c_teacher',
      width: "100px",
    },
    {
      title: '所属学期',
      dataIndex: 'c_term',
      width: "100px",
      // filters: [
      //   {
      //     text: '1',
      //     value: 1,
      //   },
      //   {
      //     text: '2',
      //     value: 2,
      //   },
      //   {
      //     text: '3',
      //     value: 3,
      //   },
      //   {
      //     text: '4',
      //     value: 4,
      //   },
      //   {
      //     text: '5',
      //     value: 5,
      //   },
      //   {
      //     text: '6',
      //     value: 6,
      //   },
      //   {
      //     text: '7',
      //     value: 7,
      //   },
      //   {
      //     text: '8',
      //     value: 8,
      //   },
      // ],
      // // specify the condition of filtering result
      // // here is that finding the name started with `value`
      // onFilter: (value, record) => record.c_term.indexOf(value) === 0,
      // sorter: (a, b) => a.name.length - b.name.length,
      // sortDirections: ['descend'],
    },
      {
        title: '操作',
        width: "100px",
        render: (_, record)=>(
            <span>
               <a onClick={()=>this.SelectCourse(record)}>选课</a>
            </span>
        ),
      },
  ];

  columns2 = [
    {
      title: '课程编号',
      dataIndex: 'c_id',
      width: "150px",
    },
      {
      title: '课程名',
      dataIndex: 'c_name',
        width: "180px",
    },
    {
      title: '授课教师',
      dataIndex: 'c_teacher',
      width: "100px",
    },
    {
      title: '所属学期',
      dataIndex: 'c_term',
      width: "100px",
      // filters: [
      //   {
      //     text: '1',
      //     value: '1',
      //   },
      //   {
      //     text: '2',
      //     value: '2',
      //   },
      //   {
      //     text: '3',
      //     value: '3',
      //   },
      //   {
      //     text: '4',
      //     value: '4',
      //   },
      //   {
      //     text: '5',
      //     value: '5',
      //   },
      //   {
      //     text: '6',
      //     value: '6',
      //   },
      //   {
      //     text: '7',
      //     value: '7',
      //   },
      //   {
      //     text: '8',
      //     value: '8',
      //   },
      // ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      // onFilter: (value, record) => record.c_term.indexOf(value) === 0,
      // sorter: (a, b) => a.name.length - b.name.length,
      // sortDirections: ['descend'],
    },
      {
        title: '操作',
        width: "100px",
        render: (_, record)=>(
            <span>
                <Space>
                  <a onClick={()=>this.DropCourse(record)}>退课</a>
                  {/*<Button onClick={()=>this.DropCourse(record)} disabled={this.state.canSelectCourse?true:false}>退课</Button>*/}
                </Space>
            </span>
        ),
      },
  ];

  columns3 = [
    {
      title: '课程编号',
      dataIndex: 'c_id',
      width: "150px",
    },
      {
      title: '课程名',
      dataIndex: 'c_name',
        width: "180px",
    },
    {
      title: '授课教师',
      dataIndex: 'c_teacher',
      width: "100px",
    },
    {
      title: '所属学期',
      dataIndex: 'c_term',
      width: "100px",
      // filters: [
      //   {
      //     text: '1',
      //     value: 1,
      //   },
      //   {
      //     text: '2',
      //     value: 2,
      //   },
      //   {
      //     text: '3',
      //     value: 3,
      //   },
      //   {
      //     text: '4',
      //     value: 4,
      //   },
      //   {
      //     text: '5',
      //     value: 5,
      //   },
      //   {
      //     text: '6',
      //     value: 6,
      //   },
      //   {
      //     text: '7',
      //     value: 7,
      //   },
      //   {
      //     text: '8',
      //     value: 8,
      //   },
      // ],
      // // specify the condition of filtering result
      // // here is that finding the name started with `value`
      // onFilter: (value, record) => record.c_term.indexOf(value) === 0,
      // sorter: (a, b) => a.name.length - b.name.length,
      // sortDirections: ['descend'],
    },
      {
        title: '操作',
        width: "100px",
        render: (_, record)=>(
            <span>
               <a onClick={()=>this.onUpdate(record)}>修改</a>
            </span>
        ),
      },
  ];


   componentDidMount() {
        if(this.props.username === 'admin'){
            this.setState({
                current_columns: this.columns3,
            })
            this.getAllCourse()
        }
        else {
            this.setState({
                current_columns: this.columns,
            })
            this.refreshCourse();
        }
    }

    refreshCourse = ()=>{
       this.getSelectedCourse();
       setTimeout(()=>{this.getCourse();}, 100);
    }

    getAllCourse = ()=>{
       HttpUtil.get(ApiUtil.API_COURSE_GET).then(re=>{
           console.log(re.c_data)
           this.setState({
               my_data: re.c_data,
           })
       }).catch(error=>{
           message.error(error.message)
       })
    }

    onUpdate = (item)=>{
      this.setState({
        showUpdateDialog: true,
        edit_record: item,
      })
      // console.log(item);
    }

    onAddCourse = ()=>{
        this.setState({
            showAddCourse: true,
        })
    }

    onDelCourse = ()=>{
        this.setState({
            showDelCourse: true,
        })
    }

    inArray = (search,array)=>{
        for(var i in array){
            if(array[i]==search){
                return true;
            }
        }
        return false;
    }

    getCourse = () =>{
       let tmp = [];
       let tmp2 = [];
       HttpUtil.get(ApiUtil.API_COURSE_GET).then(re=>{
          console.log(re.c_data)
          // console.log(this.state.selected_c_ids)
          for(var i=0; i<re.c_data.length; i++){
              if(re.c_data[i].c_term === this.props.stu_info[0].stu_term){
                   console.log('--', re.c_data[i].c_id, this.state.selected_c_ids)
                  if(this.inArray(re.c_data[i].c_id,this.state.selected_c_ids )){
                      tmp2.push(re.c_data[i])
                  }
                  else {
                      tmp.push(re.c_data[i])
                  }
              }
          }
          this.setState({
            my_data: tmp,
            my_data2: tmp2,
          })
        }).catch(error=>{
            message.error(error.message);
        })
    }

    getSelectedCourse = ()=>{
       HttpUtil.post(ApiUtil.API_SELECTED_COURSE_GET, {username: this.props.username}).then(re=>{
           // console.log(re.c_ids)
           this.setState({
               selected_c_ids: re.c_ids,
           })
       }).catch(error=>{
           message.error(error.message)
       })
    }

    SelectCourse = (item) => {
        console.log(item);
        HttpUtil.post(ApiUtil.API_RECORD_ADD, {update_data: item, update_user: this.props.username}).then(re=>{
            message.info(re.message)
            this.refreshCourse();
        }).catch(error=>{
            message.error(error.message)
        })
      }

    DropCourse = (item) => {
        console.log(item);
        HttpUtil.post(ApiUtil.API_RECORD_DEL, {del_data: item, del_user: this.props.username}).then(re=>{
            message.info(re.message)
            this.refreshCourse();
        }).catch(error=>{
            message.error(error.message)
        })
      }

    onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
      }

    render() {
       let Message
       let Message2
       if(this.props.username !== 'admin'){
           Message = (
               <div>
                   <hr/>
                    已选课程：
                    <Table
                    columns={this.columns2}
                    dataSource={this.state.my_data2}
                    onChange={this.onChange}
                    rowKey={item=>item.id}
                    pagination={{pageSize: 10}}
                    scroll={{ y: 100}} />
               </div>
           )
       }
       if(this.props.username === 'admin'){
           Message2 = (
               <div>
                   <Space>
                        <Button type='primary' onClick={this.onAddCourse}>新增</Button>
                        <Button onClick={this.onDelCourse}>删除</Button>
                    </Space>
               </div>
           )
       }
        return (
            <div>
                {Message2}
                <Table
                columns={this.state.current_columns}
                dataSource={this.state.my_data}
                onChange={this.onChange}
                rowKey={item=>item.id}
                pagination={{pageSize: 10}}
                scroll={{ y: 340}} />

                {Message}

                <CourseUpdateDialog
                visible={this.state.showUpdateDialog}
                edit_record={this.state.edit_record}
                current_user={this.props.username}
                afterClose={()=>{
                        this.setState({
                            showUpdateDialog:false
                        });
                        setTimeout(()=>{this.getAllCourse();}, 100);
                    }} />

                 <CourseAddDialog
                    visible={this.state.showAddCourse}
                    afterClose={()=>{
                            this.setState({
                                showAddCourse:false
                            });
                            setTimeout(()=>{this.getAllCourse();}, 100);
                        }}/>

                     <CourseDelDialog
                     visible={this.state.showDelCourse}
                     afterClose={()=>{
                            this.setState({
                                showDelCourse:false
                            });
                            setTimeout(()=>{this.getAllCourse();}, 100);
                        }}/>
            </div>
        );
    }
}

export default CourseTable;