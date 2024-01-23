import React from "react";
import LineChart from "../../../Chart/LineChart";

function Excellent({ sortedKey, overviewData}) {

    console.log("sortedKey: ", sortedKey)
    console.log("overviewData: ", overviewData)

    return (
        <div className="excellent">
            <LineChart totalStudentByYearList={overviewData} hKey={`Excellent`} sortedKeys={sortedKey} title={"The Excellent Student Distribution Chart by Year"}/>
        </div>
    );
}

export default Excellent;