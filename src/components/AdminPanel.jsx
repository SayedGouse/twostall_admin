import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [id, setId] = useState("");
  const itemsPerPage = 10;


  const statusUpdate = async () => {
    console.log("status before", status, id);
    
    try {
        const response = await axios.post("http://localhost:5000/api/userAppointment/getAppointmentStatus",{
            Id : id,
            Status:status
        });
        console.log(response.data);
        if(response.status === 200){
            
            window.location.reload()
        }
        
        setAppointments(response.data)
    } catch (error) {
        console.log("Error fetching data", error);
        
    }
  };

  useEffect(() => {
    statusUpdate()
  }, [status])

  const getAppointmentByAdmin = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/userAppointment/getAllAppointmentForAdmin");
        console.log(response.data);
        
        setAppointments(response.data)
    } catch (error) {
        console.log("Error fetching data", error);
        
    }
  };

  useEffect(() => {
    getAppointmentByAdmin()
  }, [status])

  const updateAppointmentStatusById = (appointments, id, status) => {
    return appointments.map(appointment =>
      appointment._id === id ? { ...appointment, status } : appointment
    );
  };
  
  const handleStatusUpdate = (id, status) => {
    setAppointments(prevAppointments => 
      updateAppointmentStatusById(prevAppointments, id, status)
    );
    setStatus(status);
    setId(id)

    
  };


  const calculateFeedback = () => {
    const total = appointments.reduce((sum, appt) => sum + appt.Feedback_Rating, 0);
    const average = (total / appointments.length).toFixed(1);
    return { total, average };
  };

  const feedback = calculateFeedback();

  // Pagination Logic
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

 
  

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Panel</h2>

      {/* Feedback Summary */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-primary">
            <div className="card-body">
              <h5 className="card-title">Average Feedback Rating</h5>
              <p className="card-text display-6">{feedback.average}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-success">
            <div className="card-body">
              <h5 className="card-title">Total Feedback Ratings</h5>
              <p className="card-text display-6">{feedback.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="card">
        <div className="card-header bg-primary text-white">Appointments</div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient Name</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((appointment, index) => (
                <tr key={appointment._id}>
                  <td>{index + 1}</td>
                  <td>{appointment.FullName}</td>
                  <td>{appointment.PhoneNo}</td>
                  <td>{appointment.Date_of_Appointment}</td>
                  <td>{appointment.Time_of_Appointment}</td>
                  <td>{appointment.Reason_for_booking}</td>
                  <td>{appointment.Feedback_Rating}</td>
                  <td>
                    <span
                      className={`badge ${
                        appointment.Status === "Approved"
                          ? "bg-success"
                          : appointment.Status === "Denied"
                          ? "bg-danger"
                          : appointment.Status === "Not Adended"
                          ? "bg-dark"
                          : appointment.Status === "Completed"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {appointment.Status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleStatusUpdate(appointment._id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleStatusUpdate(appointment._id, "Denied")}
                    >
                      Deny
                    </button>
                    <button
                      className="btn bg-primary btn-sm text-white me-2"
                      onClick={() => handleStatusUpdate(appointment._id, "Completed")}
                    >
                      Completed
                    </button>
                    <button
                      className="btn bg-dark btn-sm text-white me-2"
                      onClick={() => handleStatusUpdate(appointment._id, "Not Adended")}
                    >
                      Not Adended
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
