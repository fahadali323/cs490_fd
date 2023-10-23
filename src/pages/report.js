import React, { useState, useEffect } from 'react';
import '../styling/home.css';
import jsPDF from 'jspdf';

function Report() {
  const [data, setData] = useState([]); // create a state variable to store the data

  const generatePDF = async () => {
    try {
      const response = await fetch('http://localhost:5001/customer-rents');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const doc = new jsPDF();
      doc.autoTable({
        head: [['Customer ID', 'First Name', 'Last Name', 'Email', 'Rented Movie']],
        body: data.map((row) => [
          row.customer_id,
          row.first_name,
          row.last_name,
          row.email,
          row.rented_movie,
        ]),
      });
  
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'customer_report.pdf';
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    // use useEffect to fetch the data when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/customer-rents');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setData(data); // update the state with the fetched data
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div>
      <h2>reports page</h2>
      <button onClick={generatePDF}>Generate PDF</button>
      <div className="data-container">
        {/* display the data in a table */}
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Rented Movie</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.customer_id}>
                <td>{row.customer_id}</td>
                <td>{row.first_name}</td>
                <td>{row.last_name}</td>
                <td>{row.email}</td>
                <td>{row.rented_movie}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Report;
