import React from 'react'

const Adminhome = () => {
    const admin = JSON.parse(localStorage.getItem("userData"));
  return (
      <div className="p-6">
          <h1 className="text-3xl font-bold">Welcome, {admin.name}</h1>
          {/* <p className="text-lg">Department: {admin.department.name}</p> */}

          {/* Dashboard Sections */}
          <div className="mt-6 grid grid-cols-3 gap-6">
              <div className="bg-white p-4 shadow-lg rounded-lg">
                  <h2 className="text-xl font-semibold">Total Complaints</h2>
                  <p className="text-2xl">0</p> {/* Fetch complaints count */}
              </div>
              <div className="bg-white p-4 shadow-lg rounded-lg">
                  <h2 className="text-xl font-semibold">Resolved Complaints</h2>
                  <p className="text-2xl">0</p>{" "}
                  {/* Fetch resolved complaints */}
              </div>
              <div className="bg-white p-4 shadow-lg rounded-lg">
                  <h2 className="text-xl font-semibold">Pending Complaints</h2>
                  <p className="text-2xl">0</p> {/* Fetch pending complaints */}
              </div>
          </div>
      </div>
  );
}

export default Adminhome
