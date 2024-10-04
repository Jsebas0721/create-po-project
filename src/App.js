import Actions from "./Actions";
import Header from "./Header";
import PoList from "./PoList";
import { useEffect, useState } from "react";

function App() {
  const purchaseOrders = [
    {
      brand: "BCBG",
      style: "ARRIELLE",
      GROUP_NO: "BOAT",
      part_no: "BCARIEWIN5117",
      po_qty: 470,
      ifp_qty: 467,
      order_date: "07/4/2024",
      depart_date: "10/2/2024",
      demand_date: "12/1/2024",
      location: 1,
      vendor_no: "IOV001",
      buy_flag: "N",
      unit_cost: 12,
      MOQ_info: "300/100 per color"
    },
    {
      brand: "BCBG",
      style: "ARRIELLE",
      GROUP_NO: "AIR",
      part_no: "BCARIEBLS5117",
      po_qty: 660,
      ifp_qty: 654,
      order_date: "05/6/2024",
      depart_date: "08/4/2024",
      demand_date: "08/19/2024",
      location: 1,
      vendor_no: "IOV001",
      buy_flag: "N",
      unit_cost: 12,
      MOQ_info: "300/100 per color"
    },
    {
      brand: "BCBG",
      style: "NANNETTE",
      GROUP_NO: "BOAT",
      part_no: "BCNANNBLA5317",
      po_qty: 430,
      ifp_qty: 0,
      order_date: "07/4/2024",
      depart_date: "08/3/2024",
      demand_date: "10/2/2024",
      location: 1,
      vendor_no: "IOV001",
      buy_flag: "Y",
      unit_cost: 11.5,
      MOQ_info: "300/100 per color"
    }
  ]

  const data2 = []
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://10.1.0.25:3009")
      .then((resp) => resp.json())
      .then((data) => setData(data));
      
  }, []);

  return (
    <div className="App">
      <Header />
      <PoList poList={data} onSetData={setData} />
      <Actions />
    </div>
  );
}

export default App;
