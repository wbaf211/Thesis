import { Route, Routes } from 'react-router';
import * as XLSX from 'xlsx';
import './App.css';
import Overview from './Page/Overview/Overview';
import Compare from './Page/Compare/Compare';
import VerticalHeader from './VerticalHeader/VerticalHeader';
import data from '../src/data/data.json'
import realData from "./data/realData.json"
import { useEffect, useState } from 'react';

function App() {

  const totalYearList = [];
  const [jsonData, setJsonData] = useState(null);

  // useEffect(() => {
  //   const processExcelFile = async () => {
  //     // Specify the correct relative path to your Excel file in the "data" folder
  //     const excelFilePath = 'D:\NgoThanhThe\Thesis\thesis\src\data\data.xlsx';
  //     console.log(excelFilePath);

  //     try {
  //       const response = await fetch(excelFilePath);
  //       const data = await response.arrayBuffer();

  //       const workbook = XLSX.read(data, { type: 'array' });

  //       // Assuming the first sheet is the one you want to convert
  //       const sheetName = workbook.SheetNames[0];
  //       const sheet = workbook.Sheets[sheetName];

  //       // Convert sheet data to JSON
  //       const jsonData = XLSX.utils.sheet_to_json(sheet);

  //       // Update state with the JSON data
  //       setJsonData(jsonData);

  //       // Process the jsonData as needed
  //       console.log(jsonData);
  //     } catch (error) {
  //       console.error('Error reading Excel file:', error);
  //     }
  //   };

  //   processExcelFile();
  // }, []);

  useEffect(() => {
    for (let obj of data) {
      let i = 0;
      for (let course in obj.grade) {
        i++;
        obj.Total += obj.grade[`${course}`];
      }
      obj.Avg = (obj.Total / i).toFixed(2);
    }
  },[])

  //hàm để thêm key "year" vào data đầu vào
  function addYearKey(data) {
    const newData = data.map(item => {
        const idDigits = item.id.match(/\d+/);
        const idFirstTwoDigits = idDigits ? idDigits[0].substring(0, 2) : '';

        const year = idFirstTwoDigits.length > 0 ? "K" + idFirstTwoDigits : "Invalid";

        return { ...item, year };
    });

    return newData;
}

  const newData = addYearKey(realData);

  newData.forEach(i => {
      if (!totalYearList.includes(i.year)) {
        totalYearList.push(i.year);
      }
  });

  //hàm để lấy ra các học kỳ có trong data
  function getUniqueSemesters(data) {
    let uniqueSemesters = new Set();

  data.forEach(item => {
    let firstTwoDigits = item.sem.slice(0, 2);

    let modifiedYear = "20" + firstTwoDigits;

    let modifiedSemester = "Sem " + item.sem.slice(2);

    item.sem = `${modifiedSemester} - ${modifiedYear}`;

    uniqueSemesters.add(item.sem);
  });

  let semesterArray = Array.from(uniqueSemesters);

  semesterArray.sort((a, b) => {
    let aYear = parseInt(a.slice(-4), 10);
    let bYear = parseInt(b.slice(-4), 10);

    if (aYear !== bYear) {
      return aYear - bYear;
    }

    return a.localeCompare(b);
  });

  return semesterArray;
  }

  const semesterArray = getUniqueSemesters(newData);

  //hàm để lấy ra các môn có trong một học kỳ đó
  function formatSemCourse(data) {
    const formattedData = {};

  data.forEach(item => {
    const sem = item.sem;
    const course = item.course;

    if (!formattedData[sem]) {
      formattedData[sem] = [course];
    } else {
      if (!formattedData[sem].includes(course)) {
        formattedData[sem].push(course);
      }
    }
  });

  return formattedData;
  }
  
  const formattedData = formatSemCourse(newData);

  //hàm để tính tổng số sinh viên từng khóa
  function calculateTotalStudents(data) {
    const yearTotals = {};
  
    for (const item of data) {
        const year = item.year;
        const id = item.id;
  
        if (!yearTotals[year]) {
            yearTotals[year] = {
                total: 0,
                uniqueIds: [],
            };
        }
  
        if (!yearTotals[year].uniqueIds.includes(id)) {
            yearTotals[year].total += 1; 
            yearTotals[year].uniqueIds.push(id);
        }
    }
  
    return yearTotals;
  }

  const totalStudentByYearList = calculateTotalStudents(newData);
  const sortedKey = Object.keys(totalStudentByYearList).sort();

  //hàm để lấy ra số liệu của từng sinh viên dựa trên data đầu vào
  function transformStudentData(data) {
    const result = {};

    data.forEach(student => {
        const studentId = student.id;

        if (!result[studentId]) {
            result[studentId] = { semesters: {}, Avg: 0, classify: "", year: "" };
        }

        const semesterKey = student.sem;
        const courseKey = student.course;
        const score = parseInt(student.score);

        if (!result[studentId].semesters[semesterKey]) {
            result[studentId].semesters[semesterKey] = {};
        }

        result[studentId].semesters[semesterKey][courseKey] = score;
        result[studentId].year = student.year;
    });

    Object.keys(result).forEach(studentId => {
        const semesters = result[studentId].semesters;
        const semesterKeys = Object.keys(semesters);
        let totalSemesterAvg = 0;

        semesterKeys.forEach(semesterKey => {
            const courses = semesters[semesterKey];
            const scores = Object.values(courses);
            const sum = scores.reduce((acc, score) => acc + score, 0);
            const avg = scores.length > 0 ? sum / scores.length : 0;

            result[studentId].semesters[semesterKey].Avg = avg;
            totalSemesterAvg += avg;
        });

        const overallAvg = totalSemesterAvg / semesterKeys.length;
        result[studentId].Avg = overallAvg;

        if (overallAvg >= 80) {
            result[studentId].classify = "Excellent";
        } else if (overallAvg >= 70) {
            result[studentId].classify = "Good";
        } else if (overallAvg >= 60) {
            result[studentId].classify = "Average Good";
        } else if (overallAvg >= 50) {
            result[studentId].classify = "Average";
        } else {
            result[studentId].classify = "Bad";
        }
    });

    const finalResult = Object.keys(result).map(studentId => {
        const { semesters, Avg, classify, year } = result[studentId];
        return { [studentId]: { semesters, Avg, classify, year } };
    });

    return finalResult;
}

  const testData = transformStudentData(newData);
  
  //hàm để format lại dữ liệu sao cho phù hợp với table
  const tableData = (data) => {
    let keyCounter = 1;

    const newData = data.map((item, index) => {
    const id = Object.keys(item)[0];
    const school = id.substring(0, 2);
    const avg = parseFloat(item[id].Avg.toFixed(2));

    const key = keyCounter++;

    return { id, school, ...item[id], Avg: avg, key };
  });

  return newData;
  }

  const tabData = tableData(testData);

  //hàm để tính tổng số sinh viên dựa theo năm và xếp loại
  function countStudentsByClassifyAndYear(data) {
    const result = [];

    data.forEach(student => {
        const studentId = Object.keys(student)[0];
        const { classify, year } = student[studentId];

        if (!result[year]) {
            result[year] = {
                "Excellent": 0,
                "Good": 0,
                "Average Good": 0,
                "Average": 0,
                "Bad": 0
            };
        }

        result[year][classify]++;
    });

    const sortedYears = Object.keys(result).sort((a, b) => a.localeCompare(b));

    const finalResult = sortedYears.map(year => ({ [year]: result[year] }));

    return finalResult;
}

  const overviewStudent = countStudentsByClassifyAndYear(testData);

  //hàm để merge totalStudentByYearList và overviewStudent
  function mergeData(data, data1) {
    const mergedData = {};
  
    Object.keys(data).forEach(key => {
      const matchingData = data1.find(item => item[key]);
  
      if (matchingData) {
        mergedData[key] = {
          ...data[key],
          ...matchingData[key],
        };
      } else {
        mergedData[key] = { ...data[key] };
      }
    });
  
    return mergedData;
  }

  const overviewData = mergeData(totalStudentByYearList, overviewStudent);

  // hàm để lấy các course từ data

  const extractCourses = (data) => {
    if (!data || data.length === 0) {
    console.error('Invalid or empty JSON data.');
    return [];
  }

  let coursesList = [];

  data.forEach(item => {
    if (item && item.course) {
      const indexOfIU = item.course.indexOf("IU");

      if (indexOfIU !== -1) {
        const courseObject = {
          id: item.course.substring(0, indexOfIU + 2),
          name: item.course.substring(indexOfIU + 3)
        };

        if (!coursesList.some(course => course.id === courseObject.id)) {
          coursesList.push(courseObject);
        }
      }
    }
  });

  return coursesList;
  }

  const uniqueCourses = extractCourses(realData);

  //hàm để tính số sinh viên dựa trên xếp loại
  const countStudentsByClassify = (data) => {
    const classifyCount = {};

  data.forEach(item => {
    if (item) {
      Object.values(item).forEach(subItem => {
        if (subItem && subItem.classify) {
          const classify = subItem.classify;

          if (classifyCount[classify] === undefined) {
            classifyCount[classify] = 1;
          } else {
            classifyCount[classify]++;
          }
        }
      });
    }
  });

  return classifyCount;
  }

  const studentListByClassify = countStudentsByClassify(testData)

  console.log("newData: ", newData);
  console.log("totalStudentByYearList: ", totalStudentByYearList);
  console.log("testData: ", testData);
  console.log("overviewStudent: ", overviewStudent);
  console.log("overviewData: ", overviewData);
  console.log("uniqueCourses: ", uniqueCourses);
  console.log("studentListByClassify: ", studentListByClassify);
  console.log("semesterArray: ", semesterArray);
  console.log("formattedData: ", formattedData);
  console.log("uniqueCourses: ", uniqueCourses);

  return (
    <div className="App">
      <VerticalHeader/>
      <div className='App-content'>
        <Routes>
          <Route exact path='/' element={<Overview overviewStudent={overviewStudent} overviewData={overviewData} sortedKey={sortedKey} testData={testData} studentListByClassify={studentListByClassify} uniqueCourses={uniqueCourses}/>} />
          <Route path='/compare' element={<Compare uniqueCourses={uniqueCourses} sortedKey={sortedKey} data={tabData} classify={Object.keys(studentListByClassify)} semesterArray={semesterArray}/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
