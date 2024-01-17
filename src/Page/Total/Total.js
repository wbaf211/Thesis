import React from "react";
import './Total.css'
import LineChart from '../../Chart/LineChart'
import PieChart from "../../Chart/PieChart";

function Total({ totalStudentByYearList, sortedKey, overviewStudent, overviewData }) {

    console.log("sortedKey: ", sortedKey);
    console.log("totalStudentByYearList: ", totalStudentByYearList);

    return (
        <div className="total">
            <LineChart totalStudentByYearList={overviewData} hKey={`total`} sortedKeys={sortedKey} title={"The Total Student Distribution Chart by Year"}/>
            <div className="lower">
                {overviewStudent.map(i => {
                    return (
                        <PieChart label={Object.keys(i)} data={i}/>
                    )
                })}
            </div>
        </div>
    );
}

export default Total;