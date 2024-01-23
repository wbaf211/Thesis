import React from "react";
import LineChart from "../../../Chart/LineChart";

function Average({overviewData, sortedKey}) {
    return (
        <div className="avg">
            <LineChart totalStudentByYearList={overviewData} hKey={`Average`} sortedKeys={sortedKey} title={"The Average Student Distribution Chart by Year"}/>
        </div>
    );
}

export default Average;