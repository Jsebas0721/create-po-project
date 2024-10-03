function UpdateForm({ purchaseOrder }) {
  const {
    style,
    GROUP_NO,
    part_no,
    po_qty,
    ifp_qty,
    order_date,
    depart_date,
    demand_date,
    location,
    vendor_no,
    buy_flag,
    unit_cost,
    MOQ_info,
  } = purchaseOrder;
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <tr className="po-table__row">
      <form onSubmit={handleSubmit}>
        <td>null</td>
        <td>{style}</td>
        <td className="po-table__record">{GROUP_NO}</td>
        <td className="po-table__record">{part_no}</td>
        <td className="po-table__record">{po_qty}</td>
        <td className="po-table__record">{ifp_qty}</td>
        <td className="po-table__record">{order_date}</td>
        <td className="po-table__record">{depart_date}</td>
        <td className="po-table__record">{demand_date}</td>
        <td className="po-table__record">{location}</td>
        <td className="po-table__record">{vendor_no}</td>
        <td className="po-table__record">{buy_flag}</td>
        <td className="po-table__record">{unit_cost}</td>
        <td className="po-table__record">{MOQ_info}</td>
      </form>
    </tr>
  );
}

export default UpdateForm;
