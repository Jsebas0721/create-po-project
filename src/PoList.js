import DataTable from "datatables.net-bs5";
import "datatables.net-responsive-bs5";
import { useEffect, useState, useCallback } from "react";
import $ from "jquery";
import moment from "moment";

function PoList({ poList, onSetData }) {
  const [editingCell, setEditingCell] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const updateRowData = useCallback(
    (rowData, indexColumn, newValue) => {
      const updatedRow = { ...rowData };
      switch (indexColumn) {
        case 3:
          updatedRow.GROUP_NO = newValue;
          break;
        case 5:
          updatedRow.po_qty = newValue;
          break;
        case 9:
          updatedRow.demand_date = newValue;
          break;
        case 12:
          updatedRow.buy_flag = newValue;
          break;
        case 13:
          updatedRow.unit_cost = newValue;
          break;
        default:
          break;
      }

      fetch("http://10.1.0.25:3009/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRow),
      })
        .then((response) => {
          if (response.ok) {
            response.json().then(() => {
              const updatedPoList = poList.map((row) =>
                row.row_id_po === updatedRow.row_id_po ? updatedRow : row
              );

              onSetData(updatedPoList);
              console.log("Database updated successfully:", response.data);
            });
          } else {
            response.json().then((message) => console.log(message));
          }
        })
        .catch((error) => {
          console.log("Error updating data:", error);
        });
    },
    [poList, onSetData]
  );

  const cloneRecord = useCallback(
    (newRecord) => {
      fetch("http://10.1.0.25:3009/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecord),
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((newRecord) => {
              const updatedPoList = [...poList, newRecord];
              onSetData(updatedPoList);
            });
          } else {
            response.json().then((message) => console.log(message));
          }
        })
        .catch((error) => {
          console.log("Error cloning record:", error);
        });
    },
    [poList, onSetData]
  );

  // const deleteRecord = useCallback((deletedRecord) => {
  //   console.log(deletedRecord);
  //   fetch("http://10.1.0.25:3009/delete", {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(deleteRecord)
  //   })
  //   .then((response) => {
  //     if(response.ok){

  //     }
  //   })
  // });
  useEffect(() => {
    // if (!poList || poList.length === 0) return;

    if ($.fn.DataTable.isDataTable("#po-table")) {
      const table = $("#po-table").DataTable();
      table.clear().rows.add(poList).draw();
    } else {
      $("#po-table").DataTable({
        destroy: true,
        responsive: true,
        data: poList,
        columns: [
          {
            className: "select-checkbox",
            data: null,
            defaultContent: "",
            render: () =>
              `<input type="checkbox" class="row-checkbox"></input>`,
            orderable: false,
            width: "1%",
          },
          { data: "brand", title: "Brand" },
          { data: "style", title: "Style" },
          { data: "GROUP_NO", title: "Ship Via", className: "editable" },
          { data: "part_no", title: "Part No" },
          { data: "po_qty", title: "PO Quantity", className: "editable" },
          { data: "ifp_qty", title: "IFP Quantity" },
          { data: "order_date", title: "Order Date" },
          { data: "depart_date", title: "Depart Date" },
          { data: "demand_date", title: "Demand Date", className: "editable" },
          { data: "location", title: "Location" },
          { data: "vendor_no", title: "Vendor No." },
          { data: "buy_flag", title: "Buy Flag", className: "editable" },
          { data: "unit_cost", title: "Unit Cost", className: "editable" },
          { data: "MOQ_info", title: "MOQ info" },
          {
            data: null,
            defaultContent: "",
            render: () => '<button class="clone-button">CLONE</button>',
            orderable: false,
          },
        ],
        columnDefs: [
          {
            targets: [7, 8, 9],
            render: (data) => moment(data, "YYYY-M-D").format("M/D/YYYY"),
          },
        ],
        rowCallback: function (row, data) {
          if (data.selected) {
            $(row).addClass("selected");
          }
        },
      });
    }
  }, [poList]);

  useEffect(() => {
    function handleEditClick(e) {
      if (editingCell) return;

      const cell = $("#po-table").DataTable().cell(e.target);
      const indexColumn = cell.index().column;
      const currentData = cell.data();
      const rowData = $("#po-table").DataTable().row(e.target).data();

      setEditingCell(e.target);

      function handleBlur() {
        setTimeout(() => {
          cell.data(currentData).draw();
          setEditingCell(null);
        }, 0);
      }

      function handleSelectChange() {
        const newData = $(this).val();
        cell.data(newData).draw();
        updateRowData(rowData, indexColumn, newData);
        setEditingCell(null);
      }

      function handleDateInputChange() {
        const newData = $(this).val();
        const formattedNewData = moment(newData).startOf("day").toISOString();
        updateRowData(rowData, indexColumn, formattedNewData);
        cell.data(newData).draw();
        setEditingCell(null);
      }

      function handleInputChange() {
        const newData = $(this).val();
        updateRowData(rowData, indexColumn, newData);
        cell.data(newData).draw();
        setEditingCell(null);
      }

      if (currentData === "AIR" || currentData === "BOAT") {
        $(e.target).html(
          `<select class="form-select" name="GROUP_NO" aria-label="Default select example">
              <option selected>Open this select menu</option>
              <option value="AIR">AIR</option>
              <option value="BOAT">BOAT</option>
          </select>`
        );

        setTimeout(() => {
          const select = $(e.target).find(".form-select");
          select.focus();
          select.off("blur", handleBlur).on("blur", handleBlur);
          select
            .off("change", handleSelectChange)
            .on("change", handleSelectChange);
        }, 0);
      } else if (indexColumn === 9) {
        const currentDate = moment(currentData, "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        );
        const todayDate = moment().format("YYYY-MM-DD");

        $(e.target).html(
          `<input type="date" value="${currentDate}" min="${todayDate}" class="form-control">`
        );

        setTimeout(() => {
          const dateInput = $(e.target).find(".form-control");
          dateInput.focus();
          dateInput.off("blur", handleBlur).on("blur", handleBlur);
          dateInput
            .off("change", handleDateInputChange)
            .on("change", handleDateInputChange);
        }, 0);
      } else {
        $(e.target).html(
          `<input type="text" class="form-control" value="${currentData}" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">`
        );

        setTimeout(() => {
          const input = $(e.target).find(".form-control");
          input.focus();
          const length = input.val().length;
          input[0].setSelectionRange(length, length);
          input.off("blur", handleBlur).on("blur", handleBlur);
          input
            .off("change", handleInputChange)
            .on("change", handleInputChange);
        }, 0);
      }
    }
    function handleCheck(e) {
      const row = $(e.target).closest("tr");
      const rowData = $("#po-table").DataTable().row(row).data();
      console.log(rowData);

      if (e.target.checked) {
        row.addClass("selected");
        rowData.selected = true;
        
       
      } else {
        row.removeClass("selected");
        rowData.selected = false;
       
      }
    }

    function handleClone(e) {
      const rowData = $("#po-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data();
      console.log(rowData);
      console.log("clone button");
      const clonedRow = { ...rowData };
      cloneRecord(clonedRow);
    }

    $(".select-checkbox").on("click", handleCheck);
    $(".clone-button").on("click", handleClone);
    $("#po-table").on("click", "td.editable", handleEditClick);

    return () => {
      $("#po-table").off("click", "td.editable", handleEditClick);
      $(".clone-button").off("click", handleClone);
      $(".select-checkbox").off("click", handleCheck);
    };
  }, [editingCell, updateRowData, cloneRecord]);

  return (
    <div className="table-container">
      <table
        id="po-table"
        className="table table-striped table-hover"
        width="100%"
      ></table>
    </div>
  );
}

export default PoList;
