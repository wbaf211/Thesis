import React from "react";
import './Total.css'
import LineChart from '../../Chart/LineChart'
import PieChart from "../../Chart/PieChart";
import ScatterPlot from "../../Chart/ScatterPlot";

function Total({sortedKey, overviewStudent, overviewData, scatterPlotData }) {

    console.log("scatterPlotData: ", scatterPlotData)

    return (
        <div className="total">
            <LineChart totalStudentByYearList={overviewData} hKey={`total`} sortedKeys={sortedKey} title={"The Total Student Distribution Chart by Year"}/>
            <div className="lower">
                {/* <ScatterPlot data={scatterPlotData}/> */}
                {/* {overviewStudent.map(i => {
                    return (
                        <PieChart label={Object.keys(i)} data={i}/>
                    )
                })} */}
            </div>
        </div>
    );
}

export default Total;