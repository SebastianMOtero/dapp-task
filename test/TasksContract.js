const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", () => {

    before(async () => {
        this.tasksContract = await TasksContract.deployed();
    });

    it('Migrate deployed successfully', async () => {
        const address = this.tasksContract.address;

        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.equal(typeof address, 'string');
    })

    it('Get tasks list', async () => {
        const taskCounter = await this.tasksContract.taskCounter();
        const task = await this.tasksContract.tasks(taskCounter);

        assert.equal(task.id.toNumber(), taskCounter);
        assert.equal(task.title, 'Genesis');
        assert.equal(task.description, 'Genesis task');
        assert.equal(task.done, false);
        assert.equal(taskCounter, 1);
    })

    it('Task created successfully', async () => {
        const result = await this.tasksContract.createTask('Test Title', 'Test Description');
        const taskEvent = result.logs[0].args;
        const tasksCounter = await this.tasksContract.taskCounter();

        assert.equal(tasksCounter, 2);
        assert.equal(taskEvent.id.toNumber(), 2);
        assert.equal(taskEvent.title, 'Test Title');
        assert.equal(taskEvent.description, 'Test Description');
        assert.equal(taskEvent.done, false);
    })


    it('Task toggle done', async () => {
        const result = await this.tasksContract.toggleDone(1);
        const taskEvent = result.log[0].args;
        const task = await this.tasksContract.tasks(1);

        assert.equal(task.done, true);
        assert.equal(taskEvent.done, true);
        assert.equal(taskEvent.id, 1);
    })
})