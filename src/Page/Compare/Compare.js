import React, { useEffect, useRef, useState } from "react";
import '../Compare/Compare.css';
import SUBJECTS from '../../data/Course.json';
import PRE from '../../data/PreCourses.json';
import year from '../../data/year.json'
import {
    UsergroupAddOutlined,
    CloseOutlined,
    SearchOutlined,
    DownOutlined
} from '@ant-design/icons';
import { Select, Table } from "antd";
import RadarChart from "../../Chart/RadarChart";
import GrpLineChart from "../../Chart/GrpLineChart";
import DLineChart from "../../Chart/dLineChart";

let list;
let preList = [];

function Compare({sortedKey, newList, uniqueCourses, data, classify}) {

    console.log("tabData: ", data);

    function extractUniqueSchools(data) {
        const uniqueSchools = [];
    
        data.forEach(item => {
            const { school } = item;
            if (!uniqueSchools.includes(school)) {
                uniqueSchools.push(school);
            }
        });
    
        return uniqueSchools;
    }
    
    const uniqueSchoolsArray = extractUniqueSchools(data);

    let dataSource = data;
    let tempData = data;

    const calcAvg = (list) => {
        for (let i = 0; i < list?.length; i++) {
            let max = 0;
            for (let j = 0; j < course?.length; j++) {
                max += list[i].grade[`${course[j]}`]
            }
            list[i].cTotal = max 
            list[i].cAvg = (list[i].cTotal / course?.length).toFixed(2)
        }
    }

    // check duplicate
    // const checkDup = (arr) => {
    //     if (arr.length > 0) {
    //         for (let i = 0; i < arr.length; i++) {
    //             for (let j = i+1; j < arr.length; j++) {
    //                 if (arr[i] === arr[j]) { 
    //                     arr.splice(j, 1)
    //                     j--
    //                 }
    //             }
    //         }
    //         return arr
    //     } else {
    //         return arr;
    //     }
    // }

    // const checkPre = () => {
    //     for (let obj in PRE) {
    //         if (course[course.length - 1] == obj) {
    //             hasPreCourse(true);
    //             setA(obj);
    //             tempList = tempList.concat(PRE[`${obj}`]);
    //         }
    //     }
    // }

    const linechartData = [10, 20, 15, 25, 18, 30];

    const datum = {};

    for (let i = 0; i < newList?.length; i++) {
        datum[`${newList[i]}`] = 0
    }

    const [open, isOpen] = useState(false);
    const [radarData, setRadarData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState();

    const [spec, getSpec] = useState();
    const [school, getSchool] = useState();
    const [year, getYear] = useState();
    const [course, getCourse] = useState();
    const [key, setKey] = useState(0);

    if (spec === undefined && year === undefined && school === undefined) {
        dataSource = data
    } else {
        if (spec != undefined) {
            tempData = tempData.filter(data => (data.classify == spec));
            dataSource = tempData;
        } 
        if (year != undefined) {
            tempData = tempData.filter(data => (data.year == year));
            dataSource = tempData;
        }
        if (school != undefined) {
            tempData = tempData.filter(data => (data.school == school))
            dataSource = tempData;
        }
    }

    const filter = () => {
        if (course === undefined || course?.length === 0) {
            if (spec != undefined && year != undefined) {
                dataSource = tempData.filter(data => (data.classify == spec && data.year == year));
            } else if (spec != undefined) {
                dataSource = tempData.filter(data => data.classify == spec);
            } else if (year != undefined) {
                dataSource = tempData.filter(data => data.year == year);
            }
        } else {
            if (spec != undefined && year != undefined) {
                dataSource = tempData.filter(data => (data.classify == spec && data.year == year));
            } else if (spec != undefined) {
                dataSource = tempData.filter(data => data.classify == spec);
            } else if (year != undefined) {
                dataSource = tempData.filter(data => data.year == year);
            }
        }

        setKey(key + 1);
    }

    const reset = () => {
        setSelectedRows([]);
        list = [];
        setSelectedRowKeys();
    }

    const checkPre = () => {
        if (course?.length < 0) {
            return;
        } else {
            for (let obj in PRE) {
                for (let i = 0; i < course?.length; i++) {
                    if (course[i] == obj) {
                        preList = preList.concat(PRE.obj)
                        console.log("course: ",course[i])
                        console.log("pre course: ", PRE[course[i]])
                    }
                }
                // console.log("pre list: ", preList)
                // console.log("PRE: ",obj)
            }
        }
    }

    const closeTable = () => {
        dataSource = data;
        isOpen(false);
        getSpec();
        getYear();
        getCourse();
    }
    
    const columns = [
        {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
        },
        {
            key: 'school',
            title: 'School',
            dataIndex: 'school'
        },
        {
            key: 'year',
            title: 'Year',
            dataIndex: 'year'
        },
        {
            key: 'classify',
            title: 'Classify',
            dataIndex: 'classify'
        },
        {
            key: "Avg",
            title: "Average",
            dataIndex: "Avg",
            sorter: (a, b) => a.Avg - b.Avg,
            defaultSortOrder: 'desc',
        }
    ]

    const customColumns = [
        {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
        },
        {
            key: 'school',
            title: 'School',
            dataIndex: 'school'
        },
        {
            key: 'year',
            title: 'Year',
            dataIndex: 'year'
        },
        {
            key: 'spec',
            title: 'Specialization',
            dataIndex: 'spec'
        },
        {
            key: "cAvg",
            title: "Average",
            dataIndex: "cAvg",
            sorter: (a, b) => a.cAvg - b.cAvg,
            defaultSortOrder: 'desc'
        }
    ]

    useEffect(() => {
        filter();
    }, [spec, year])

    useEffect(() => {
        checkPre();
        calcAvg(data)
        filter();
    }, [course])

    return (
        <div className="compare">
            <header>
                <h1>Compare</h1>
            </header>

            <div className="button-container">
                <button onClick={() => isOpen(true)}>Add Student</button>
                <button onClick={() => reset()}>Reset</button>
            </div>

            <div className="compare-section">
                {selectedRows?.length > 0 && (
                    <div className="studentList-container">
                        <React.Fragment>
                            {
                                selectedRows?.map(i => (
                                    <div className="student-container">
                                        <table>
                                            <tr>
                                                <td><p><b>ID</b></p></td>
                                                <td>: {i.id}</td>
                                            </tr>
                                            <tr>
                                                <td><p><b>Year</b></p></td>
                                                <td>: {i.year}</td>
                                            </tr>
                                            <tr>
                                                <td><p><b>Classify</b></p></td>
                                                <td>: {i.classify}</td>
                                            </tr>
                                        </table>
                                    </div>
                                ))
                            }
                        </React.Fragment>
                    </div>
                )}

                <div className="chartList-container">
                    {list?.length > 0 && (
                        <div>
                            <div className="chart-container"><RadarChart/></div>
                            <div className="chart-container"><DLineChart data={linechartData}/></div>
                        </div>
                    )}
                </div>
            </div>

            {open && (
                <div className="window">
                    <div className="table-container" >
                        <div className="filter-section">
                            <div className="left-side">
                                <Select
                                    className="filter"
                                    mode="multiple"
                                    allowClear="true"
                                    placeholder="Choose courses"
                                    options={uniqueCourses.map(subject => {
                                        return {
                                            label: `${subject.name}`,
                                            value: subject.name
                                        }
                                    })}
                                    onChange={rec => getCourse(rec)}
                                />
                                {/* {preList?.length === 0 ?
                                    <React.Fragment>
                                        <Select 
                                            className="filter"
                                            mode="multiple"
                                            disabled="true"
                                            allowClear="true"
                                            placeholder="Choose pre courses"
                                            options={preList?.map(subject => {
                                                return {
                                                    label: `${subject}`,
                                                    value: subject
                                                }
                                            })}
                                        />
                                    </React.Fragment> :
                                    <React.Fragment>
                                        <Select 
                                            className="filter"
                                            mode="multiple"
                                            disabled="false"
                                            allowClear="true"
                                            placeholder="Choose pre courses"
                                            options={preList?.map(subject => {
                                                return {
                                                    label: `${subject}`,
                                                    value: subject
                                                }
                                            })}
                                        />
                                    </React.Fragment>
                                } */}
                            </div>
                            <div className="right-side">
                                <Select 
                                    className="filter"
                                    placeholder="Year"
                                    allowClear="true"
                                    options={sortedKey.map(year => {
                                        return {
                                            label: `${year}`,
                                            value: year
                                        }
                                    })}
                                    onChange={rec => getYear(rec)}
                                />
                                <Select 
                                    className="filter"
                                    placeholder="School"
                                    allowClear="true"
                                    options={uniqueSchoolsArray.map(data => {
                                        return {
                                            label: `${data}`,
                                            value: data
                                        }
                                    })}
                                    onChange={rec => getSchool(rec)}
                                />
                                <Select 
                                    className="filter"
                                    placeholder="Classify"
                                    allowClear="true"
                                    options={classify.map(spec => {
                                        return {
                                            label: `${spec}`,
                                            value: spec
                                        }
                                    })}
                                    onChange={rec => getSpec(rec)}
                                />
                            </div>
                        </div>
                        
                        {(course === undefined || course?.length === 0) ? (
                            <Table
                            className="table"
                            bordered 
                            columns={columns} 
                            dataSource={dataSource} 
                            pagination={{position: ["topCenter"], pageSize: 10}}
                            rowSelection={{
                                selectedRowKeys: selectedRowKeys,
                                onChange:(selectedRowKeys, selectedRows) => {
                                    setSelectedRowKeys(selectedRowKeys);
                                    setSelectedRows(selectedRows);
                                    console.log("selectedRowKeys: ", selectedRowKeys)
                                    console.log("selectedRows: ", selectedRows)
                                    }
                                }} 
                            />
                        ) : (
                            <Table
                            className="table"
                            bordered 
                            columns={customColumns} 
                            dataSource={dataSource} 
                            pagination={{position: ["topCenter"], pageSize: 10}}
                            rowSelection={{
                                selectedRowKeys: selectedRowKeys,
                                onChange:(selectedRowKeys, selectedRows) => {
                                    setSelectedRowKeys(selectedRowKeys);
                                    setSelectedRows(selectedRows);
                                    console.log("selectedRowKeys: ", selectedRowKeys)
                                    console.log("selectedRows: ", selectedRows)
                                    }
                                }} 
                            />
                        )}

                        <div className="button-section">
                                <button id="okButton" onClick={() => (list = selectedRows,closeTable())}>OK</button>
                                <button id="cancelButton" onClick={() => closeTable()}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Compare;