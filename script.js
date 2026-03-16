// HTMLのid要素を取得
const taskInput = document.getElementById("taskInput"); //入力欄
const addButton = document.getElementById("addButton"); //追加ボタン
const taskList = document.getElementById("taskList"); //タスクリスト
const taskCount = document.getElementById("taskCount"); //タスク数

let tasks = []; //配列でタスクを管理
let currentFilter = "all";

//保存されたタスクを読み込む
loadTasks();
//ボタンを押したら処理を実行
addButton.addEventListener("click", addTask);
//Enterキーで追加（入力欄でEnterを押すと追加）
taskInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});


//タスク追加の処理
function addTask()
{
    //↓入力された文字を取得
    const text = taskInput.value.trim(); //trim()で空白削除
    if(text === "") return; //入力が空なら追加しない
    //タスクをオブジェクトとして作成
    const task = 
    {
        id: Date.now(), //タスク識別(Date.now現在の時刻)
        text: text, //タスク内容
        completed:false //完了状態
    };
    tasks.push(task); //配列に追加
    saveTasks(); //LocalStorageに保存
    renderTasks(); //画面を更新
    taskInput.value=""; //入力欄を空にする
}

//タスクを表示の処理
function renderTasks(){
    taskList.innerHTML=""; //重複防止のため一度リストを空にする
    let filteredTasks = tasks;

    if(currentFilter === "active"){
    filteredTasks = tasks.filter(t => !t.completed);
    }
    if(currentFilter === "completed"){
    filteredTasks = tasks.filter(t => t.completed);
    }

    //配列を１つずつ処理
    filteredTasks.forEach(task => {
    const li = document.createElement("li"); //<li>を作成
    //完了のチェック
    if(task.completed){
    li.classList.add("completed"); //<li>に.completedが適用され線が付く
    }
    //タスクテキスト作成（表示）
    const span = document.createElement("span");
    span.textContent = task.text;
    //完了切り替え  未完了と完了を切り替える
    span.onclick = () => {
    task.completed = !task.completed; //"!"はtrueとfalseの反転
    saveTasks();
    renderTasks();
    };

    //削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.classList.add("delete-btn");

    //削除処理
    deleteBtn.onclick = () => {
    //このID以外を残す
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    renderTasks();
    };
    //要素を組み立て
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    });

    updateTaskCount();
}

//タスク数表示
function updateTaskCount()
{
    taskCount.textContent = tasks.length;
}
//フィルター(状態で管理)
function setFilter(filter)
{
    currentFilter = filter; //(all active completed)
    renderTasks();
}

//LocalStorage保存
function saveTasks()
{
    localStorage.setItem("tasks", JSON.stringify(tasks));//オブジェクト→文字列
}

//LocalStorageを読み込む
function loadTasks()
{
    const data = localStorage.getItem("tasks");
    if(data){
    tasks = JSON.parse(data); //文字列→オブジェクト
    }
    renderTasks();
}

/*
[全体の流れ]
・ページ読み込み→LocalStorageから読み込み→画面表示
・タスク追加→tasks配列追加→LocalStorageを保存→画面更新

[説明]
JavaScriptでタスクを配列で管理し、LocalStorageを使用してデータを保存
render関数で配列を元に、DOMを再生成する仕組み
タスクフィルター機能、Enterキー操作なども実装
*/