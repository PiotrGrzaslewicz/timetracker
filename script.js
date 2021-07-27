const apikey = '8b0e9fbf-31dd-4da7-a6c9-57b62dce37ce';
const apihost = 'https://todo-api.coderslab.pl';


document.addEventListener('DOMContentLoaded', function () {
    // 30a0aeba-f310-4122-8957-15147df59ede

    // apiUpdateTask("30a0aeba-f310-4122-8957-15147df59ede","Learn more about HTTP methods", "", "open").then(res=>{});

    apiListTasks().then(res => {
        console.log(res.data);
        res.data.forEach(task => renderTask(task.id, task.title, task.description, task.status))
    })

    const form = document.querySelector(".js-task-adding-form");
    form.addEventListener("submit", e => {
        e.preventDefault();
        const inputs = form.querySelectorAll("input");
        apiCreateTask(inputs[0].value, inputs[1].value).then(res => {
            renderTask(res.data.id, res.data.title, res.data.description, res.data.status);
        })
    })

});

function apiListTasks() {
    return fetch(apihost + `/api/tasks`,
        {
            headers: {Authorization: apikey}
        }).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(`Wystąpił błąd: ${res.statusText}`);
            }
        }
    )
}

function apiListOperationsForTask(taskId) {
    return fetch(apihost + "/api/tasks/" + taskId + "/operations",
        {
            headers: {
                Authorization: apikey,
            }
        }
    ).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error('Wystąpił błąd: ${res.statusText}');
        }
    })
}

function apiCreateTask(title, description) {
    return fetch(apihost + "/api/tasks",
        {
            headers: {
                Authorization: apikey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({title: title, description: description, status: `open`}),
            method: "POST"
        }
    ).then(res => {
        if (res.ok) {

            return res.json();

        } else {
            throw new Error(`Wystąpił błąd: ${res.statusText}`);
        }
    })
}

function apiUpdateTask(taskId, title, description, status) {

    return fetch(apihost + "/api/tasks/" + taskId, {
        headers: {
            Authorization: apikey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({title: title, description: description, status: status}),
        method: "PUT"
    }).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error("Wystąpił błąd: " + res.statusText);
        }
    })

}

function apiDeleteTask(taskId) {
    return fetch(apihost + "/api/tasks/" + taskId, {
        headers: {
            Authorization: apikey,
            "Content-Type": "application/json"
        },
        method: "DELETE"
    }).then(res => {
        return res;
    })
}

function apiCreateOperationForTask(taskId, description) {
    return fetch(apihost + "/api/tasks/" + taskId + "/operations", {
        headers: {
            Authorization: apikey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({description: description, timeSpent: 0}),
        method: "POST"
    }).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Wystąpił błąd: ${res.statusText}`);
        }
    })
}

function apiGetOperationById(operationId) {
    return fetch(apihost + "/api/operations/" + operationId, {
            headers: {
                Authorization: apikey,
            }
        }
    ).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Wystąpił błąd: ${res.statusText}`);

        }
    })
}

function apiDeleteOperation(operationId) {
    return fetch(apihost + "/api/operations/" + operationId, {
            headers: {
                Authorization: apikey,
            },
            method: "DELETE"
        }
    ).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Wystąpił błąd: ${res.statusText}`);

        }
    })
}

function apiUpdateOperation(operationId, description, timeSpent) {
    return fetch(apihost + "/api/operations/" + operationId, {
            headers: {
                Authorization: apikey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({description: description, timeSpent: timeSpent}),
            method: "PUT"
        }
    ).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Wystąpił błąd: ${res.statusText}`);

        }
    })
}

function renderTask(taskId, title, description, status) {

    const section = document.createElement("section");
    section.className = "card mt-5 shadow-sm";
    document.querySelector("main").append(section);

    const headerDiv = document.createElement("div");
    headerDiv.className = "card-header d-flex justify-content-between align-items-center";
    section.append(headerDiv);

    const headerLeftDiv = document.createElement("div");
    headerDiv.append(headerLeftDiv);

    const h5 = document.createElement("h5");
    h5.innerText = title;
    headerLeftDiv.append(h5);

    const h6 = document.createElement("h6");
    h6.className = "card-subtitle text-muted";
    h6.innerText = description;
    headerLeftDiv.append(h6);

    const headerRightDiv = document.createElement("div");
    headerDiv.append(headerRightDiv);

    if (status === "open") {
        const finishButton = document.createElement("button");
        finishButton.className = "tn btn-dark btn-sm js-task-open-only";
        finishButton.innerText = "Finish";
        headerRightDiv.append(finishButton);

        finishButton.addEventListener("click", e => {
            apiUpdateTask(taskId, title, description, "closed").then(res => {
                const toDelete = section.querySelectorAll(".js-task-open-only");
                toDelete.forEach(el => {
                    el.remove();
                });
            })
        })
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-outline-danger btn-sm ml-2"
    deleteButton.innerText = "Delete";
    headerRightDiv.append(deleteButton);
    deleteButton.addEventListener('click', e => {
        apiDeleteTask(taskId).then(res => {
                section.remove();
            }
        )
    })

    const ul = document.createElement("ul");
    ul.className = "list-group list-group-flush";
    section.append(ul);

    apiListOperationsForTask(taskId).then(res => {
        res.data.forEach(operation => renderOperation(ul, status, operation.id, operation.description, operation.timeSpent))
    })

    if (status === "open") {
        const formDiv = document.createElement("div");
        formDiv.className = "card-body js-task-open-only";
        formDiv.innerHTML = "<form>\n" +
            "        <div class=\"input-group\">\n" +
            "          <input type=\"text\" placeholder=\"Operation description\" class=\"form-control\" minlength=\"5\" >\n" +
            "          <div class=\"input-group-append\">\n" +
            "            <button class=\"btn btn-info\">Add</button>\n" +
            "          </div>\n" +
            "        </div>\n" +
            "      </form>";
        section.append(formDiv);

        const input = formDiv.querySelector("input");
        const btn = formDiv.querySelector("button");
        btn.addEventListener("click", e => {
            e.preventDefault();
            if (input.value.length < 5) {
                alert("Nazwa musi mieć co najmniej 5 znaków");
                input.value = "";
            } else {
                apiCreateOperationForTask(taskId, input.value).then(res => {
                    renderOperation(ul, status, res.data.id, res.data.description, res.data.timeSpent);
                    input.value = "";
                })
            }
        })
    }
}

function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    operationsList.append(li);

    const descriptionDiv = document.createElement("div");
    descriptionDiv.innerText = operationDescription;
    li.append(descriptionDiv);

    const time = document.createElement("span");
    time.className = "badge badge-success badge-pill ml-2";
    time.innerText = timeFormat(parseInt(timeSpent));
    descriptionDiv.append(time);

    if (status === "open") {
        const rightDiv = document.createElement("div");
        rightDiv.innerHTML = `<button class="btn btn-outline-success btn-sm mr-2 js-task-open-only">+15m</button>
          <button class="btn btn-outline-success btn-sm mr-2 js-task-open-only">+1h</button>
          <button class="btn btn-outline-danger btn-sm js-task-open-only">Delete</button>`;
        li.append(rightDiv);

        const btns = rightDiv.querySelectorAll("button");
        btns[0].addEventListener("click", e => {
            apiGetOperationById(operationId).then(res => {
                    timeSpent = parseInt(res.data.timeSpent) + 15;
                    apiUpdateOperation(operationId, res.data.description, timeSpent).then(res => {
                        time.innerText = timeFormat(parseInt(res.data.timeSpent));
                    })
                }
            )
        })
        btns[1].addEventListener("click", e => {
            apiGetOperationById(operationId).then(res => {
                    timeSpent = parseInt(res.data.timeSpent) + 60;
                    apiUpdateOperation(operationId, res.data.description, timeSpent).then(res => {
                        time.innerText = timeFormat(parseInt(res.data.timeSpent));
                    })
                }
            )
        })

        btns[2].addEventListener("click", e => {
            apiDeleteOperation(operationId).then(res => {
                li.remove();
            })
        })


    }
}

function timeFormat(number) {
    let h = parseInt(number / 60);
    let min = number - (h * 60);
    return `${h}h ${min}m`;
}