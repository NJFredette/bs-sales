let order = [];
let orderTotal = 0;
let historyTable;
let employeeCost = {};

$(document).ready(function() {
 // Initialize DataTables with buttons
    historyTable = $('#history-table').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel',
        ],
		order: [[1, 'desc']]
    });

    // Add item event listeners using event delegation
    $('.menu-item').on('click', 'button', function() {
        const itemName = $(this).parent().siblings('span').text();
        const quantity = parseInt($(this).text().replace('x', ''));
        addItem(itemName, quantity);
    });

    // Confirm order button click event
    $('#confirm-order-btn').on('click', confirmOrder);

    // Clear order button click event
    $('#clear-order-btn').on('click', clearOrder);
});

function addItem(name, quantity) {
    const price = getItemPrice(name); // Get the price based on the item name
    order.push({ name, quantity, price });
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderList = $('#order-list');
    orderList.empty();
    orderTotal = 0;

    order.forEach(item => {
        const itemTotal = item.quantity * item.price;
        orderList.append(`<li>${item.quantity}x ${item.name} - $${itemTotal.toFixed(2)}</li>`);
        orderTotal += itemTotal;
    });

    $('#order-total').text(orderTotal.toFixed(2));
}

function confirmOrder() {
    const date = new Date().toLocaleString();
    const orderDetails = order.map(item => `${item.quantity}x ${item.name}`).join(', ');
    const selectedName = $('#employee-names').val();

    // Add the total cost to the employeeCost object
    if (!employeeCost[selectedName]) {
        employeeCost[selectedName] = 0;
    }
    employeeCost[selectedName] += orderTotal;

    // Add the order to the DataTable
    historyTable.row.add([selectedName, date, orderDetails, `$${orderTotal.toFixed(2)}`]).draw();
    
    // Update the employee cost summary
    updateEmployeeCostSummary();

    clearOrder();
}

function clearOrder() {
    order = [];
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderList = $('#order-list');
    orderList.empty();
    orderTotal = 0;

    order.forEach(item => {
        const itemTotal = item.quantity * item.price;
        orderList.append(`<li>${item.quantity}x ${item.name} - $${itemTotal.toFixed(2)}</li>`);
        orderTotal += itemTotal;
    });

    $('#order-total').text(orderTotal.toFixed(2));
}

function updateEmployeeCostSummary() {
    const employeeCostSummary = $('#employee-cost-summary');
    employeeCostSummary.empty();

    Object.entries(employeeCost).forEach(([employee, cost]) => {
        employeeCostSummary.append(`<p>${employee}: $${cost.toFixed(2)}</p>`);
    });
}

function getItemPrice(name) {
    // Implement your logic to get the price based on the item name
    // For simplicity, returning hardcoded prices here
    switch (name) {
        case 'Combo Meal':
            return 150;
		case 'Heartstopper':
            return 100;
		case 'BS Cola':
            return 30;
        // Add cases for other menu items
        default:
            return 0;
    }
}


