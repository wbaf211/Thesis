import React, { useState } from "react";
import './Overview.css';
import data from '../../data/data.json'
import {
    SearchOutlined
} from '@ant-design/icons';
import Total from "../Total/Total";
import Excellent from "../Classify/Excellent/Excellent";
import Good from "../Classify/Good/Good";
import Average from "../Classify/Average/Average";
import Bad from "../Classify/Bad/Bad";
import AverageGood from "../Classify/AverageGood/AverageGood";
import { Select } from "antd";

function Overview({ overviewStudent, overviewData, sortedKey, testData, studentListByClassify, uniqueCourses }) {

    const list = {
        Excellent: [],
        Good: [],
        Avg: [],
        Bad: []
    }

    const [select, setSelect] = useState(1);

    for (let obj of data) {
        if (obj.Avg > 80) {
            list.Excellent.push(obj);
        } else if (obj.Avg <= 80 && obj.Avg > 70) {
            list.Good.push(obj);
        } else if (obj.Avg <=70 && obj.Avg >= 50) {
            list.Avg.push(obj);
        } else {
            list.Bad.push(obj);
        }
    }

    
    const iuii = [
        { x: 1, y: 5 },
        { x: 2, y: 9 },
        { x: 3, y: 7 },
        { x: 4, y: 3 },
        { x: 5, y: 6 },
    ];

    return (
        <div className="overview">
            
            <header>
                <h1>Overview</h1>
                <div className="right-side">
                    <input placeholder="Search"></input>
                    <div><SearchOutlined /></div>
                </div>
            </header>

            <div className="overview-content">

                <div className="left">
                    <h3 className="child">General Stat</h3>

                    <div className={`child container ${select === 1 ? `select` : ''}`} onClick={() => setSelect(1)}>
                        <span className="title">Total</span>
                        <span className="stat">{testData.length} Students</span>
                    </div>
                    <div className={`child container ${select === 2 ? `select` : ''}`} onClick={() => setSelect(2)}>
                        <span className="title">Excellent</span>
                        <span className="stat">{studentListByClassify.Excellent} Students</span>
                    </div>
                    <div className={`child container ${select === 3 ? `select` : ''}`} onClick={() => setSelect(3)}>
                        <span className="title">Good</span>
                        <span className="stat">{studentListByClassify.Good} Students</span>
                    </div>
                    <div className={`child container ${select === 4 ? `select` : ''}`} onClick={() => setSelect(4)}>
                        <span className="title">Average Good</span>
                        <span className="stat">{studentListByClassify["Average Good"]} Students</span>
                    </div>
                    <div className={`child container ${select === 5 ? `select` : ''}`} onClick={() => setSelect(5)}>
                        <span className="title">Average</span>
                        <span className="stat">{studentListByClassify.Average} Students</span>
                    </div>
                    <div className={`child container ${select === 6 ? `select` : ''}`} onClick={() => setSelect(6)}>
                        <span className="title">Bad</span>
                        <span className="stat">{studentListByClassify.Bad} Students</span>
                    </div>
                    <Select 
                    className="child select"
                    mode="multiple"
                    placeholder="Filter Course"
                    options={uniqueCourses.map(course => {
                        return {
                            label: `${course.name}`,
                            value: course.name
                        }
                    })}
                    />
                </div>

                <div className="svg-container">
                    {select === 1 && (
                        <Total sortedKey={sortedKey} overviewStudent={overviewStudent} overviewData={overviewData} scatterPlotData={iuii}/>
                    )} 
                    {select === 2 && (
                        <Excellent overviewData={overviewData} sortedKey={sortedKey}/>
                    )}
                    {select === 3 && (
                        <Good overviewData={overviewData} sortedKey={sortedKey}/>
                    )}
                    {select === 4 && (
                        <AverageGood overviewData={overviewData} sortedKey={sortedKey}/>
                    )}
                    {select === 5 && (
                        <Average overviewData={overviewData} sortedKey={sortedKey}/>
                    )}
                    {select === 6 && (
                        <Bad overviewData={overviewData} sortedKey={sortedKey} />
                    )}
                </div>
            </div>  

        </div>
    );
}

export default Overview;