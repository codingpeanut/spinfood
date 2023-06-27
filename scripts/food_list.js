// in foodlist.html

// initialize firebase api
firebase.initializeApp(firebaseConfig);

// food_list reference path in firebase
var foodListRef = firebase.database().ref("food_list");

// push restaurant info to firebase 接收餐廳資料
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

// pull restaurant info from firebase 接收餐廳資料
foodListRef.on("child_added", function (snapshot) {
    var key = snapshot.key;
    var restaurant_name = snapshot.val().label;
    var restaurant_message = snapshot.val().message;

    // var food_list = [];
    // food_list.push({
    //     key: key,
    //     label: restaurant_name,
    //     message: restaurant_message
    // });
    // console.log(food_list[key]);

    createFoodElement(key, restaurant_name);
});

// create restaurant list element 建立清單物件
function createFoodElement(key, restaurant_name) {
    // create element
    var foodElement = document.createElement("div");
    foodElement.setAttribute("id", key);
    // foodElement.setAttribute("style", "display: inline-flex; width: 100%; justify-content: space-between;");
    foodElement.setAttribute("style", "display: grid; grid-template-columns: auto auto; margin-bottom: 1rem;");

    // restaurant label
    var foodLabel = document.createElement("div");
    foodLabel.innerText = restaurant_name;
    foodLabel.setAttribute("class", "label");
    foodLabel.setAttribute("style", "overflow-wrap: anywhere; width: fit-content; font: caption;");

    // operation area
    var modifyElement = document.createElement("div");
    modifyElement.setAttribute("style", "display: inline-flex; align-items: center; justify-content: flex-end;");

    // delete button
    var deleteFoodButton = document.createElement("button");
    deleteFoodButton.innerText = "刪除";
    deleteFoodButton.setAttribute("class", "delete");
    deleteFoodButton.setAttribute("onclick", "deleteFood(\"" + key + "\")");
    // deleteFoodButton.setAttribute("style", "width: 50%;");

    // modify button
    var editFoodButton = document.createElement("button");
    editFoodButton.innerText = "修改";
    editFoodButton.setAttribute("class", "modify");
    editFoodButton.setAttribute("onclick", "editFood(\"" + key + "\")");
    // editFoodButton.setAttribute("style", "width: 50%;");

    // append delete and modify button to operation area
    modifyElement.append(deleteFoodButton, editFoodButton);
    foodElement.append(modifyElement);

    // append to restaurant list area
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
    var selected_foodId = document.getElementById(foodId);
    var selectedFoodLabelDiv = selected_foodId.querySelector(".label");
    // console.log(selectedFoodLabel);

    if (selectedFoodLabelDiv != null) { // if div exist, create textarea
        // 創建textarea物件
        var setFoodLabelTextarea = document.createElement("textarea");
        setFoodLabelTextarea.setAttribute("class", "label_textarea");
        setFoodLabelTextarea.setAttribute("style", "resize: none; border: none; padding: 0; font: caption; height:" + selectedFoodLabelDiv.offsetHeight + "px;");
        console.log(selectedFoodLabelDiv.font);
        console.log(selectedFoodLabelDiv.offsetHeight);

        // 將textarea的數值設為原本div的數值
        setFoodLabelTextarea.value = selectedFoodLabelDiv.innerText;

        // 將div更換為textarea
        selectedFoodLabelDiv.replaceWith(setFoodLabelTextarea);

        // 將刪除按鈕暫時關閉
        var selectedFoodDelete = document.getElementById(foodId).querySelector(".delete");
        selectedFoodDelete.setAttribute("style", "display: none;");

        // dynamically resize textarea height 動態調整textarea高度
        var selectedFoodLabelTextarea = selected_foodId.querySelector(".label_textarea");
        selectedFoodLabelTextarea.addEventListener('input', function () {
            selectedFoodLabelTextarea.style.height = 'auto'; // Reset the height to auto to recalculate the actual height
            selectedFoodLabelTextarea.style.height = selectedFoodLabelTextarea.scrollHeight + 'px'; // Set the height to match the scroll height
            console.log(selectedFoodLabelTextarea.scrollHeight);
        });
        // console.log(modifiedInput);
    }

    if (selectedFoodLabelDiv == null) { // if textarea exist, create div
        // 顯示刪除按鈕
        var selectedFoodDelete = document.getElementById(foodId).querySelector(".delete");
        selectedFoodDelete.setAttribute("style", "display: inline-block;");

        // 找textarea
        var modifiedInput = document.getElementById(foodId).querySelector("textarea");

        // 創建div物件
        var setFoodLabelDiv = document.createElement("div");
        setFoodLabelDiv.innerText = modifiedInput.value;
        setFoodLabelDiv.setAttribute("class", "label");
        setFoodLabelDiv.setAttribute("style", "overflow-wrap: anywhere; width: fit-content; font: caption;");

        // 更新textarea輸入的數值
        foodListRef.child(foodId).update({
            label: modifiedInput.value,
            message: modifiedInput.value
        });

        // 將textarea更換回div
        modifiedInput.replaceWith(setFoodLabelDiv);

        // console.log(setFoodLabel);
    }

}