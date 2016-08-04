const graph = require('../../graphology/lib/index')
global.graphDataPath = __dirname;
const task = {}

function createTask(task){
	graph.load();
	const taskObject = {}
	taskObject.title = task.title;
	taskObject.status = true;
	taskObject.comments = '';
	taskObject.date = task.date;
	taskObject.assgnByName = task.assgnByName
	taskObject.assgnByPhon = task.assgnByPhon;
	taskObject.assgnToName = task.assgnToName
	taskObject.assgnToPhon = task.assgnToPhon;

	const taskNode = new graph.Node('task', taskObject);

	let query = new graph.Query(graph.find('phone', task.assgnByPhon));
	var assignee = query.next();
	console.log(assignee);

	let query2 = new graph.Query(graph.find('phone', task.assgnToPhon));
	var assigner = query2.next();
	console.log(assigner);

	taskNode.addEdge('by', assignee);
	taskNode.addEdge('to', assigner);
	graph.save();

}


function getTasks(userId){
    graph.load();
    var user = new graph.Query(graph.find('phone', userId));
 
    var temp = user.next().in;
    var result = [];

    for (var key in temp){
    	if (temp[key].type!=='child'){
    		var taskId = temp[key].in;
    		result.push(graph.read(taskId).data);
    	}
    }
    return result;
}

task.handleGet = function(req,res,next){
//    var task = {"task":"project","id":"123"}
	var id = req.params.phonenm
    console.log(id);
    let list = getTasks(id);
    res.send(list);

}

task.handlePost = function(req,res,next){
	var newTask = new Object()

	newTask.title = req.body.title;
	newTask.assgnByName = req.body.assgnByName;
	newTask.assgnByPhon = req.body.assgnByPhon;
	newTask.assgnToName = req.body.assgnToName;
	newTask.assgnToPhon = req.body.assgnToPhon;
	newTask.date = req.body.date;

	console.log(newTask);
	createTask(newTask);
	res.status(200).json({
		message:"Task created succussfully"
	})
}
export default task 