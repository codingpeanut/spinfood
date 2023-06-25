// in list.html
firebase.initializeApp(firebaseConfig);

var foodListRef = firebase.database().ref("food_list");

// 發送訊息
function sendMessage() {
    var restaurantInput = document.getElementById("messageInput");
    var restaurant_name = restaurantInput.value;
    // console.log(restaurant_name);

    foodListRef.push().set({
        label: restaurant_name,
        message: restaurant_name
    });

    restaurantInput.value = "";
}

// 接收訊息
// var food_list = [];
foodListRef.on("child_added", function (snapshot) {
    var key = snapshot.key;
    var restaurant_name = snapshot.val().label;
    var restaurant_message = snapshot.val().message;

    // food_list.push({
    //     key: key,
    //     label: restaurant_name,
    //     message: restaurant_message
    // });
    // console.log(food_list[key]);

    createFoodElement(key, restaurant_name);
});

function createFoodElement(key, restaurant_name) {
    // create element
    var foodElement = document.createElement("div");
    foodElement.setAttribute("id", key);
    foodElement.setAttribute("style", "display: inline-flex; width: 100%;justify-content: space-between;");

    var foodLabel = document.createElement("div");
    foodLabel.innerText = restaurant_name;
    foodLabel.setAttribute("class", "label");

    // delete button
    var modifyElement = document.createElement("div");
    modifyElement.setAttribute("style", "display: inline-flex;")
    var deleteFoodButton = document.createElement("button");
    deleteFoodButton.innerText = "刪除";
    deleteFoodButton.setAttribute("class", "delete");
    deleteFoodButton.setAttribute("onclick", "deleteFood(\"" + key + "\")");
    var editFoodButton = document.createElement("button");
    // modify button
    editFoodButton.innerText = "修改";
    editFoodButton.setAttribute("class", "modify");
    editFoodButton.setAttribute("onclick", "editFood(\"" + key + "\")");
    modifyElement.append(deleteFoodButton, editFoodButton);
    foodElement.append(modifyElement);

    foodElement.appendChild(foodLabel);
    foodElement.appendChild(modifyElement);
    document.getElementById("food_data").appendChild(foodElement);
}

function deleteFood(foodId) {
    // console.log(foodId);
    foodListRef.child(foodId).remove();
    document.getElementById(foodId).remove();
}

function editFood(foodId) {
    var selectedFoodLabel = document.getElementById(foodId).querySelector(".label");
    // console.log(selectedFoodLabel);

    if (selectedFoodLabel != null) { // if div exist, create textarea
        // 創建textarea物件
        var modifiedInput = document.createElement("textarea");
        modifiedInput.setAttribute("style", "resize: none; width: inherit; height: inherit;");

        // 將textarea的數值設為原本div的數值
        modifiedInput.value = selectedFoodLabel.innerText;

        // 將div更換為textarea
        selectedFoodLabel.replaceWith(modifiedInput);

        // 將刪除按鈕暫時關閉
        var selectedFoodDelete = document.getElementById(foodId).querySelector(".delete");
        selectedFoodDelete.setAttribute("style", "display: none;");

        // console.log(modifiedInput);
    }

    if (selectedFoodLabel == null) { // if textarea exist, create div
        // 顯示刪除按鈕
        var selectedFoodDelete = document.getElementById(foodId).querySelector(".delete");
        selectedFoodDelete.setAttribute("style", "display: inline-block;");

        // 找textarea
        var modifiedInput = document.getElementById(foodId).querySelector("textarea");

        // 創建div物件
        var setFoodLabel = document.createElement("div");
        setFoodLabel.innerText = modifiedInput.value;
        setFoodLabel.setAttribute("class", "label");

        // 更新textarea輸入的數值
        foodListRef.child(foodId).update({
            label: modifiedInput.value,
            message: modifiedInput.value
        });

        // 將textarea更換回div
        modifiedInput.replaceWith(setFoodLabel);

        // console.log(setFoodLabel);
    }

}