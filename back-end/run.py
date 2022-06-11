from flask import Flask, request
from flask_cors import CORS
import json
import pymysql
import threading

app = Flask(__name__, template_folder='../front-end', static_folder='../front-end', static_url_path='')
cors = CORS(app, resources=r'/*')

# 连接数据库
db = pymysql.connect(host='127.0.0.1', user='root', password='123456', database='gs_student_managerment')

lock = threading.Lock()

@app.route('/hi')
def hi():
    return 'hi~'


# api接口前缀
apiPrefix = '/api/v1/'

######################  React接口 ##################
@app.route(apiPrefix + 'login', methods=['POST'])
def login():
    data = request.get_data(as_text=True)        # 从前端拿数据，是str类型
    front_data = json.loads(data)
    re = {}

    # 检查db连接是否失效
    db.ping(reconnect=True)
    # 使用 cursor() 方法创建一个游标对象 cursor
    cursor = db.cursor()
    sql = 'select students.stu_id, students.stu_name, students.stu_sex, students.stu_age, students.stu_address, class.class_name, students.stu_term, students.stu_password from students, class where students.class_id=class.class_id and students.stu_name=%s;'
    cursor.execute(sql, [front_data['username']])
    u = cursor.fetchone()
    sql2 = 'select * from teachers where t_name=%s;'
    cursor.execute(sql2, [front_data['username']])
    t = cursor.fetchone()
    # print(u)        # (3180611002, '葛优', '男', 20, '北京市海淀区葛家大院', 1801, 5, '123456')
    sql3 = 'select pass from admin where name=%s;'
    cursor.execute(sql3, ['admin'])
    admin_pass = cursor.fetchone()
    db.close()
    if(u):
        if(u[1] == front_data['username'] and u[7] == front_data['password']):
            r = [{
                'stu_id': u[0],
                'stu_name': u[1],
                'stu_sex': u[2],
                'stu_age': u[3],
                'stu_address': u[4],
                'stu_class': u[5],
                'stu_term': u[6],
            }, ]
            re = {
                'u_cate': 'stu',
                'u_data': r,
                'message': '测试成功',
            }
    elif(t):
        if(t[1] == front_data['username'] and t[4] == front_data['password']):
            r = [{
                't_id': t[0],
                't_name': t[1],
                't_sex': t[2],
                't_age': t[3],
            }, ]
            re = {
                'u_cate': 'teacher',
                'u_data': r,
                'message': '测试成功',
            }
    elif(front_data['username'] == 'admin' and front_data['password']):
        re = {
            'u_cate': 'admin',
            'message': '测试成功',
        }
    return json.dumps(re)

@app.route(apiPrefix + 'getStu', methods=['POST'])
def getStu():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    db.ping(reconnect=True)
    cursor = db.cursor()
    r = []
    if(front_data['username'] == 'admin'):
        sql = 'select students.stu_id, students.stu_name, students.stu_sex, students.stu_age, students.stu_address, class.class_name, students.stu_term, students.stu_password from students, class where students.class_id=class.class_id;'
        cursor.execute(sql)
        u = cursor.fetchall()
        if(u):
            for item in u:
                a = {
                    'stu_id': item[0],
                    'stu_name': item[1],
                    'stu_sex': item[2],
                    'stu_age': item[3],
                    'stu_address': item[4],
                    'stu_class': item[5],
                    'stu_term': item[6],
                    'stu_password': item[7],
                }
                r.append(a)
    else:
        sql = 'select students.stu_id, students.stu_name, students.stu_sex, students.stu_age, students.stu_address, class.class_name, students.stu_term, students.stu_password from students, class where students.class_id=class.class_id and students.stu_name=%s;'
        cursor.execute(sql, [front_data['username']])
        u = cursor.fetchone()
        if (u):
            r = [{
                'stu_id': u[0],
                'stu_name': u[1],
                'stu_sex': u[2],
                'stu_age': u[3],
                'stu_address': u[4],
                'stu_class': u[5],
                'stu_term': u[6],
                'stu_password': u[7],
            }, ]
    db.close()

    re = {
        'u_data': r,
    }
    return json.dumps(re)

@app.route(apiPrefix + 'getCourse')
def getCourse():
    db.ping(reconnect=True)
    cursor = db.cursor()
    sql = 'select courses.c_id,courses.c_name,teachers.t_name,courses.c_term from courses, teachers where courses.t_id=teachers.t_id;'
    cursor.execute(sql)
    u = cursor.fetchall()
    r = []
    db.close()
    # print(u)
    for item in u:
        # print(item)
        a = {
            'c_id': item[0],
            'c_name': item[1],
            'c_teacher': item[2],
            'c_term': item[3],
        }
        r.append(a)
    re = {
        'c_data': r,
    }
    return json.dumps(re)

@app.route(apiPrefix + 'updateStu', methods=['POST'])
def updateStu():
    print('xxxxxxxx')
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    print(front_data)
    re = {}
    db.ping(reconnect=True)
    cursor = db.cursor()
    cursor.execute('select * from students where stu_id=%s;', front_data['update_id'])
    r_data = cursor.fetchone()
    # print(r_data)       # (3180611002, '葛优', '女', 9, '北京市海淀区葛家大院1102', 1801, 5, '123456')
    cursor.execute('select class_id from class where class_name = %s;', front_data['update_data']['stu_class'])
    c_id = cursor.fetchone()
    if (front_data['update_data']['stu_id'] != r_data[0]):
        # print('----------')
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update students set stu_id = %s where stu_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [front_data['update_data']['stu_id'], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        db.close()
    if(front_data['update_data']['stu_name'] != r_data[1]):
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update students set stu_name = %s where stu_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [front_data['update_data']['stu_name'], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        db.close()
    if(front_data['update_data']['stu_sex'] != r_data[2]):
        # print('++++++++++++')
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update students set stu_sex = %s where stu_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [front_data['update_data']['stu_sex'], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        db.close()
    if (front_data['update_data']['stu_age'] != r_data[3]):
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update students set stu_age = %s where stu_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [front_data['update_data']['stu_age'], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        db.close()
    if (front_data['update_data']['stu_address'] != r_data[4]):
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update students set stu_address = %s where stu_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [front_data['update_data']['stu_address'], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        db.close()
    if (front_data['update_data']['stu_term'] != r_data[6]):
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update students set stu_term = %s where stu_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [front_data['update_data']['stu_term'], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        db.close()
    if (c_id[0] != r_data[5]):
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update students set class_id = %s where stu_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [c_id[0], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        db.close()
    if (front_data['update_data']['stu_password'] != r_data[7]):
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update students set stu_password = %s where stu_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [front_data['update_data']['stu_password'], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        db.close()

    return json.dumps(re)

@app.route(apiPrefix + 'getSelectedCourse', methods=['POST'])
def getSelectedCourse():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    # print(front_data)
    db.ping(reconnect=True)
    cursor = db.cursor()
    sql = 'select records.c_id from records, students where records.stu_id = students.stu_id and students.stu_name = %s;'
    cursor.execute(sql, [front_data['username']])
    u = cursor.fetchall()
    # print(u)
    db.close()
    re = {
        'c_ids': u,
    }
    return json.dumps(re)

@app.route(apiPrefix + 'addRecord', methods=['POST'])
def addRecord():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    db.ping(reconnect=True)
    cursor = db.cursor()
    cursor.execute('select stu_id from students where stu_name = %s;', [front_data['update_user']])
    u = cursor.fetchone()
    cursor.execute('select t_id from courses where c_id = %s;', [front_data['update_data']['c_id']])
    t = cursor.fetchone()
    try:
        rr = cursor.execute('insert into records(stu_id, c_id, t_id) values(%s, %s, %s);', [u[0], front_data['update_data']['c_id'], t[0]])
        db.commit()
        if (rr):
            message = '选课成功！'
        else:
            message = '操作失败！'
    except:
        db.rollback()
        message = '操作失败！'
    db.close()
    re = {
        'message': message
    }
    return json.dumps(re)

@app.route(apiPrefix + 'delRecord', methods=['POST'])
def delRecord():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    db.ping(reconnect=True)
    cursor = db.cursor()
    cursor.execute('select stu_id from students where stu_name = %s;', [front_data['del_user']])
    u = cursor.fetchone()
    cursor.execute('select scores from records where stu_id = %s and c_id = %s;', [u[0], front_data['del_data']['c_id']])
    s = cursor.fetchone()
    if(s[0]):
        return json.dumps({'message': '退课失败！'})
    else:
        try:
            rr = cursor.execute('delete from records where stu_id = %s and c_id = %s;', [u[0], front_data['del_data']['c_id']])
            db.commit()
            if (rr):
                message = '退课成功！'
            else:
                message = '操作失败！'
        except:
            db.rollback()
            message = '操作失败！'
        db.close()
        re = {
            'message': message
        }
    return json.dumps(re)

@app.route(apiPrefix + 'getRecord', methods=['POST'])
def getRecord():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    db.ping(reconnect=True)
    cursor = db.cursor()
    if(front_data['username'] == 'admin'):
        sql = 'select records.record_id, students.stu_name, courses.c_name, teachers.t_name, scores from records, students, teachers, courses where records.stu_id=students.stu_id and records.t_id=teachers.t_id and records.c_id=courses.c_id;'
        cursor.execute(sql)
        u = cursor.fetchall()
    elif(front_data['u_cate'] == 'stu'):
        sql = 'select records.record_id, students.stu_name, courses.c_name, teachers.t_name, scores from records, students, teachers, courses where records.stu_id=students.stu_id and records.t_id=teachers.t_id and records.c_id=courses.c_id and students.stu_name=%s;'
        cursor.execute(sql, [front_data['username']])
        u = cursor.fetchall()
    elif(front_data['u_cate'] == 'teacher'):
        sql = 'select records.record_id, students.stu_name, courses.c_name, teachers.t_name, scores from records, students, teachers, courses where records.stu_id=students.stu_id and records.t_id=teachers.t_id and records.c_id=courses.c_id and teachers.t_name=%s;'
        cursor.execute(sql, [front_data['username']])
        u = cursor.fetchall()
    r = []
    db.close()
    for item in u:
        a = {
            'record_id': item[0],
            'record_stu': item[1],
            'record_course': item[2],
            'record_teacher': item[3],
            'scores': item[4],
        }
        r.append(a)
    re = {
        'record_data': r,
    }
    return json.dumps(re)

@app.route(apiPrefix + 'getTea', methods=['POST'])
def getTea():
    # 拿到前端传递的数据，赋值给data变量
    data = request.get_data(as_text=True)
    # print(data, type(data))         # {"username":"刘星"} <class 'str'>
    front_data = json.loads(data)
    # print(front_data, type(front_data))   # {'username': '刘星'} <class 'dict'>
    # 判断db连接是否断开
    db.ping(reconnect=True)
    cursor = db.cursor()
    r = []
    if (front_data['username'] == 'admin'):
        sql = 'select * from teachers;'
        cursor.execute(sql)
        u = cursor.fetchall()
        if (u):
            for item in u:
                a = {
                    't_id': item[0],
                    't_name': item[1],
                    't_sex': item[2],
                    't_age': item[3],
                    't_password': item[4],
                }
                r.append(a)
    else:
        sql = 'select t_id, t_name, t_sex, t_age, t_password from teachers where t_name=%s;'
        # 执行数据库查询操作
        cursor.execute(sql, [front_data['username']])
        # 接收数据库的返回结果
        u = cursor.fetchone()
        if (u):
            r = [{
                't_id': u[0],
                't_name': u[1],
                't_sex': u[2],
                't_age': u[3],
                't_password': u[4],
            }, ]
    # 关闭db
    db.close()
    re = {
        'u_data': r,
    }
    return json.dumps(re)

@app.route(apiPrefix + 'updateTea', methods=['POST'])
def updateTea():
    print('xxx')
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    re = {}
    db.ping(reconnect=True)
    cursor = db.cursor()
    cursor.execute('select * from teachers where t_id = %s;', front_data['update_id'])
    r_data = cursor.fetchone()
    if (front_data['update_data']['t_id'] != r_data[0]):
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update teachers set t_id = %s where t_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [front_data['update_data']['t_id'], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        finally:
            db.close()
    if(front_data['update_data']['t_name'] != r_data[1]):
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update teachers set t_name = %s where t_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [front_data['update_data']['t_name'], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        finally:
            db.close()
    if(front_data['update_data']['t_sex'] != r_data[2]):
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update teachers set t_sex = %s where t_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [front_data['update_data']['t_sex'], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        finally:
            db.close()
    if (front_data['update_data']['t_age'] != r_data[3]):
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update teachers set t_age = %s where t_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [front_data['update_data']['t_age'], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        finally:
            db.close()
    if (front_data['update_data']['t_password'] != r_data[4]):
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'update teachers set t_password = %s where t_id = %s;'
        try:
            lock.acquire()
            cursor.execute(sql, [front_data['update_data']['t_password'], front_data['update_id']])
            lock.release()
            db.commit()
            re = {
                'message': '修改成功！'
            }
        except:
            db.rollback()
            re = {
                'message': '操作失败！'
            }
        finally:
            db.close()

    return json.dumps(re)

@app.route(apiPrefix + 'updateRecord', methods = ['POST'])
def updateRecord():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    re = {}
    db.ping(reconnect=True)
    cursor = db.cursor()
    sql = 'update records set scores = %s where record_id=%s;'
    try:
        cursor.execute(sql, [front_data['update_data']['scores'], front_data['update_id']])
        db.commit()
        re = {
            'message': '修改成功！'
        }
    except:
        db.rollback()
        re = {
            'message': '操作失败！'
        }
    db.close()
    return json.dumps(re)

@app.route(apiPrefix + 'addStu', methods=['POST'])
def addStu():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    # 新增用户名不能是admin
    if(front_data['add_data']['stu_name'] == 'admin'):
        message = '操作失败！'
    else:
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'insert into students values(%s, %s, %s, %s, %s, %s, %s, %s);'
        try:
            rr = cursor.execute(sql, [front_data['add_data']['stu_id'], front_data['add_data']['stu_name'], front_data['add_data']['stu_sex'], front_data['add_data']['stu_age'], front_data['add_data']['stu_address'], front_data['add_data']['class_id'], front_data['add_data']['stu_term'], front_data['add_data']['stu_password']])
            db.commit()
            if (rr):
                message = '添加成功！'
            else:
                message = '操作失败！'
        except:
            db.rollback()
            message = '操作失败！'
        db.close()
    re = {
        'message': message
    }
    return json.dumps(re)

@app.route(apiPrefix + 'delStu', methods=['POST'])
def delStu():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    db.ping(reconnect=True)
    cursor = db.cursor()
    sql = 'delete from students where stu_id=%s;'
    try:
        rr = cursor.execute(sql, [front_data['del_id']['stu_id']])
        db.commit()
        if (rr):
            message = '删除成功！'
        else:
            message = '操作失败！'
    except:
        db.rollback()
        message = '操作失败！'
    db.close()
    re = {
        'message': message
    }
    return json.dumps(re)

@app.route(apiPrefix + 'addTea', methods=['POST'])
def addTea():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    # 新增用户名不能是admin
    if(front_data['add_data']['t_name'] == 'admin'):
        message = '操作失败！'
    else:
        db.ping(reconnect=True)
        cursor = db.cursor()
        sql = 'insert into teachers values(%s, %s, %s, %s, %s);'
        try:
            rr = cursor.execute(sql, [front_data['add_data']['t_id'], front_data['add_data']['t_name'], front_data['add_data']['t_sex'], front_data['add_data']['t_age'], front_data['add_data']['t_password']])
            db.commit()
            if(rr):
                message = '添加成功！'
            else:
                message = '操作失败！'
        except:
            db.rollback()
            message = '操作失败！'
        db.close()
    re = {
        'message': message
    }
    return json.dumps(re)

@app.route(apiPrefix + 'delTea', methods=['POST'])
def delTea():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    db.ping(reconnect=True)
    cursor = db.cursor()
    sql = 'delete from teachers where t_id=%s;'
    try:
        rr = cursor.execute(sql, [front_data['del_id']['t_id']])
        db.commit()
        if (rr):
            message = '删除成功！'
        else:
            message = '操作失败！'
    except:
        db.rollback()
        message = '操作失败！'
    db.close()
    re = {
        'message': message
    }
    return json.dumps(re)

@app.route(apiPrefix + 'updateCourse', methods=['POST'])
def updateCourse():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    re = {}
    db.ping(reconnect=True)
    cursor = db.cursor()
    sql = 'select c_id from records;'
    cursor.execute(sql)
    cids = cursor.fetchall()
    db.close()
    c_array = []
    for c in cids:
        c_array.append(c[0])
    if(front_data['update_data']['c_id'] in c_array):
        return json.dumps({'message': '操作失败！'})
    else:
        if ('c_id' in front_data['update_data']):
            db.ping(reconnect=True)
            cursor = db.cursor()
            sql = 'update courses set c_id = %s where c_id = %s;'
            try:
                cursor.execute(sql, [front_data['update_data']['c_id'], front_data['update_id']])
                db.commit()
                re = {
                    'message': '修改成功！'
                }
            except:
                db.rollback()
                re = {
                    'message': '操作失败！'
                }
            db.close()
        if('c_name' in front_data['update_data']):
            db.ping(reconnect=True)
            cursor = db.cursor()
            sql = 'update courses set c_name = %s where c_id = %s;'
            try:
                cursor.execute(sql, [front_data['update_data']['c_name'], front_data['update_id']])
                db.commit()
                re = {
                    'message': '修改成功！'
                }
            except:
                db.rollback()
                re = {
                    'message': '操作失败！'
                }
            db.close()
        if('c_teacher' in front_data['update_data']):
            db.ping(reconnect=True)
            cursor = db.cursor()
            cursor.execute('select t_id from teachers where t_name=%s;', [front_data['update_data']['c_teacher']])
            teacher_id = cursor.fetchone()
            sql = 'update courses set t_id = %s where c_id = %s;'
            try:
                cursor.execute(sql, [teacher_id, front_data['update_id']])
                db.commit()
                re = {
                    'message': '修改成功！'
                }
            except:
                db.rollback()
                re = {
                    'message': '操作失败！'
                }
            db.close()
        if ('c_term' in front_data['update_data']):
            db.ping(reconnect=True)
            cursor = db.cursor()
            sql = 'update courses set c_term = %s where c_id = %s;'
            try:
                cursor.execute(sql, [front_data['update_data']['c_term'], front_data['update_id']])
                db.commit()
                re = {
                    'message': '修改成功！'
                }
            except:
                db.rollback()
                re = {
                    'message': '操作失败！'
                }
            db.close()

    return json.dumps(re)

@app.route(apiPrefix + 'addCourse', methods=['POST'])
def addCourse():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    db.ping(reconnect=True)
    cursor = db.cursor()
    cursor.execute('select t_id from teachers where t_name=%s;', [front_data['add_data']['c_teacher']])
    teacher_id = cursor.fetchone()
    sql = 'insert into courses values(%s, %s, %s, %s);'
    try:
        rr = cursor.execute(sql, [front_data['add_data']['c_id'], front_data['add_data']['c_name'], front_data['add_data']['c_term'], teacher_id])
        db.commit()
        if (rr):
            message = '添加成功！'
        else:
            message = '操作失败！'
    except:
        db.rollback()
        message = '操作失败！'
    db.close()
    re = {
        'message': message
    }
    return json.dumps(re)

@app.route(apiPrefix + 'delCourse', methods=['POST'])
def delCourse():
    data = request.get_data(as_text=True)
    front_data = json.loads(data)
    db.ping(reconnect=True)
    cursor = db.cursor()
    sql = 'delete from courses where c_id=%s;'
    try:
        rr = cursor.execute(sql, [front_data['del_id']['c_id']])
        db.commit()
        if (rr):
            message = '删除成功！'
        else:
            message = '操作失败！'
    except:
        db.rollback()
        message = '操作失败！'
    db.close()
    re = {
        'message': message
    }
    return json.dumps(re)



if __name__ == "__main__":
    app.run(debug=True, port=5001)