import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AddBOL from './screens/AddBOL'
import ManageBOL from './screens/ManageBOL'

const WarehouseTQPage = () => {
  return (
    <Routes>
        <Route path="/add" element={<AddBOL />} />
        <Route path="/management-bol" element={<ManageBOL />} />
    </Routes>
  )
}

export default WarehouseTQPage