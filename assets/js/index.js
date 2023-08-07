const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    function formatIDR(price) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
      }).format(price);
    }

    function updateTransactionList() {
      const transactionList = document.getElementById("transactionItems");
      transactionList.innerHTML = "";

      transactions.forEach((item, index) => {
        const transactionItem = document.createElement("div");
        transactionItem.classList.add("transaction-item");
        transactionItem.innerHTML = `<span>${item.name}</span> - Harga: ${formatIDR(item.price)} - Jumlah: ${item.quantity} - Total: ${formatIDR(item.price * item.quantity)} - Tanggal: ${item.date} - Status: ${item.status}
        <button class="editBtn" data-index="${index}">Edit</button>`;
        transactionList.appendChild(transactionItem);
      });
    }

    document.getElementById("transactionItems").addEventListener("click", function (event) {
      if (event.target.classList.contains("editBtn")) {
        const index = event.target.getAttribute("data-index");
        const transaction = transactions[index];

        document.getElementById("itemName").value = transaction.name;
        document.getElementById("itemPrice").value = transaction.price;
        document.getElementById("itemQuantity").value = transaction.quantity;
        document.getElementById("transactionDate").value = transaction.date;
        document.getElementById("transactionStatus").value = transaction.status;

        transactions.splice(index, 1);
        updateTransactionList();
      }
    });

    document.getElementById("addItemBtn").addEventListener("click", function () {
      const itemName = document.getElementById("itemName").value;
      const itemPrice = parseFloat(document.getElementById("itemPrice").value);
      const itemQuantity = parseInt(document.getElementById("itemQuantity").value);
      const transactionDate = document.getElementById("transactionDate").value;
      const transactionStatus = document.getElementById("transactionStatus").value;

      if (itemName && !isNaN(itemPrice) && !isNaN(itemQuantity) && transactionDate && transactionStatus) {
        const total = itemPrice * itemQuantity;

        const editedTransactionIndex = transactions.findIndex(
          (item) =>
            item.name === itemName &&
            item.price === itemPrice &&
            item.quantity === itemQuantity &&
            item.date === transactionDate &&
            item.status === transactionStatus
        );

        if (editedTransactionIndex !== -1) {
          transactions[editedTransactionIndex] = {
            name: itemName,
            price: itemPrice,
            quantity: itemQuantity,
            date: transactionDate,
            status: transactionStatus,
          };
        } else {
          transactions.push({
            name: itemName,
            price: itemPrice,
            quantity: itemQuantity,
            date: transactionDate,
            status: transactionStatus,
          });
        }

        document.getElementById("itemName").value = "";
        document.getElementById("itemPrice").value = "";
        document.getElementById("itemQuantity").value = "";
        document.getElementById("transactionDate").value = "";
        document.getElementById("transactionStatus").value = "";

        updateTransactionList();
      }
    });

    document.getElementById("downloadExcelBtn").addEventListener("click", function () {
      const data = transactions.map(item => ({
        "Nama Barang": item.name,
        "Harga Barang": formatIDR(item.price),
        "Jumlah Barang": item.quantity,
        "Total": formatIDR(item.price * item.quantity),
        "Tanggal Transaksi": item.date,
        "Status": item.status
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transaksi Penjualan");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      saveAsExcelFile(excelBuffer, "transaksi_penjualan");
    });

    document.getElementById("saveDataBtn").addEventListener("click", function () {
      localStorage.setItem("transactions", JSON.stringify(transactions));
      alert("Data transaksi telah disimpan!");
    });

    updateTransactionList();