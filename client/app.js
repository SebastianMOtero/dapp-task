App = {
    contracts: {},

    init: async () => {
        console.log('Loaded');
        await App.loadEthereum();
        await App.loadAccount();
        await App.loadContracts();
        await App.render();
        App.renderTasks();
    },

    loadEthereum: async () => {
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            await window.ethereum.request({ method: 'eth_requestAccounts' })
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        }
        else console.log('No Web3 Provider Found')
    },

    loadAccount: async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        App.account = accounts[0];
    },

    loadContracts: async () => {
        const res = await fetch("TasksContract.json")
        const tasksContractJSON = await res.json();

        App.contracts.tasksContract = TruffleContract(tasksContractJSON);

        App.contracts.tasksContract.setProvider(App.web3Provider);
        App.tasksContract = await App.contracts.tasksContract.deployed();
        console.log(App.tasksContract)
    },

    render: () => {
        document.getElementById('account').innerText = App.account;
    },

    renderTasks: async () => {
        const tasksCounter = await App.tasksContract.taskCounter();
        const taskCounterNumber = tasksCounter.toNumber();

        let html = '';
        console.log(taskCounterNumber)
        console.log(await App.tasksContract.tasks(0))
        for (let i = 1; i <= taskCounterNumber; i++) {
            const task = await App.tasksContract.tasks(i);
            console.log(task)

            const taskId = task[0]
            const taskTitle = task[1]
            const taskDescription = task[2]
            const taskDone = task[3]
            const taskCreatedAt = task[4]

            // task[0]
            let taskElement = `
                <div class="card bg-dark mb-2">
                    <div class="card-header d-flex justify-content-between aling-items-center">
                        <span>${taskTitle}</span>
                        <div class="form-check form-switch">
                            <input class="form-check-input" data-id="${taskId}" type="checkbox" ${taskDone && "checked"} onchange="App.toggleDone(this)"/>    
                        </div> 
                    </div>
                    <div class="card-body">
                        <span>${taskDescription}</span>
                        <p class="text-muted">Task was created ${new Date(taskCreatedAt * 1000).toLocaleString()}</p>
                        </label>
                    </div>
                </div>`;
            
            html += taskElement;
        }
        
        document.querySelector('#taskList').innerHTML = html;
    },

    createTask: async (title, description) => {
        const result = await App.tasksContract.createTask(title, description, {from: App.account});
        console.log(result.logs[0].args)
    },

    toggleDone: async (element) => {
        const taskId = element.dataset.id;

        try {
            await App.tasksContract.toggleDone(taskId, {
                from: App.account
            });
        } catch (error) {
            if (error.code === 4001) {
                alert('Transaction rejected');
            }
        }
        window.location.reload();
    }
}
