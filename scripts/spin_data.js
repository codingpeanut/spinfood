// in foodwheel.html

firebase.initializeApp(firebaseConfig);

// food_list
var foodListRef = firebase.database().ref("food_list");
var food_list = [], data = [];
// 接收訊息
// 監聽資料庫節點的更動事件
foodListRef.on("value", function (snapshot) {
    // 這個函數將在資料庫節點有任何更動時被執行
    food_list = []; // 清空現有的 food_list
    snapshot.forEach(function (childSnapshot) {
        var restaurant_name = childSnapshot.val().label;
        var restaurant_message = childSnapshot.val().message;
        var restaurant_value = childSnapshot.val().value;
        var data_key = childSnapshot.key;
        food_list.push({
            key: data_key,
            label: restaurant_name,
            message: restaurant_message
        });
    });

    data = food_list;
    updatePieChart(data);
    console.log(food_list);
});


// foodListRef.on("child_added", function (snapshot) {
//     var key = snapshot.key;
//     var restaurant_name = snapshot.val().label;
//     var restaurant_message = snapshot.val().message;

//     food_list.push({
//         key: key,
//         label: restaurant_name,
//         message: restaurant_message
//     });
//     // console.log(food_list[key]);

//     data = food_list;
//     updatePieChart(data);
//     console.log(food_list);
// });

// latest_data
var messagesRef = firebase.database().ref("spin_data");
// 發送訊息
function sendSpinResult(spin_key) {
    messagesRef.push().set({
        spinResult: spin_key
    });
    // console.log(spin_key);
}

// 接收訊息
messagesRef.limitToLast(10).on("child_added", function (snapshot) {
    var result = snapshot.val().spinResult;

    var resultElement = document.createElement("div");
    var dataResult = data.find(data => data.key === result);
    if (dataResult) {
        resultElement.innerText = dataResult.label;
        document.getElementById("latest_data").appendChild(resultElement);
        // console.log(dataResult);
    }

    // console.log(result);
});
