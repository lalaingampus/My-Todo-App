import React, { Component } from "react";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";
import "./my-task-list.css";

class MyTaskList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: "",
            tasklist: []
        };
    }

    // On load get the task list
    componentDidMount = () => {
        this.getTasks();
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    // Add task to the list
    onSubmit = () => {

        // Check is task was empty string
        if (this.state.task) {

            // Get the task list from the local storage
            let tasklist = JSON.parse(localStorage.getItem("tasklist"));

            // Task list is null means empty
            // Create an empty list
            if (tasklist == null) {
                tasklist =[];
            }

            // Create task object
            // Default status is false
            let task = {
                task: `? ${this.state.task}`,
                status: false
            };

            // Add the task to the task list
            tasklist.push(task);

            // Save the task list in the local storage
            localStorage.setItem("tasklist", JSON.stringify(tasklist));
            
            // Clear the form
            this.setState({task: ""});

            // Refresh the tasks
            this.getTasks();
        }
    };

    // Get all the tasks
    getTasks = () => {
        
        // Get the task list from the localstorage
        let tasklist = JSON.parse(localStorage.getItem("tasklist"));

        // Check if task list is empty
        if (tasklist) {

            // Sort all the tasks on the basic of status
            // Completed task will move down
            tasklist = tasklist.sort((a,b) => {
                if (a.status) {
                    return 1;
                } else if (b.status) {
                    return -1;
                }
                return 0;
            });

            // Save the task list in the local storage
            localStorage.setItem("tasklist", JSON.stringify(tasklist));

            // Set the tasklist to the state
            this.setState({

                // Default color
                // Incomplete: yellow
                // Complete: green
                tasklist: tasklist.map((item, index) => {
                    let color = "yellow";
                    let cardBackground = {background: "white"};
                    let taskComplete = {textDecoration: "none"};

                    if (item.status) {
                        color = "green";
                        cardBackground.background = "beige";
                        taskComplete["textDecoration"] = "line-through";
                    }
                    return (
                        <Card key={index} color={color} fluid style={cardBackground}>
                            <Card.Content>
                                <Card.Header textAlign="left" style={taskComplete}>
                                    <div style={{ wordWrap: "break-word"}}>{item.task}</div>
                                </Card.Header>

                                <Card.Meta textAlign="right">
                                    <Icon
                                        link
                                        name="check circle"
                                        color="green"
                                        onClick={() => this.updateTask(index)}
                                    />
                                    <span style={{ paddingRight: 10 }}>Done</span>
                                    <Icon
                                        link
                                        name="undo"
                                        color="yellow"
                                        onClick={() => this.undoTask(index)}
                                    />
                                    <span style={{ paddingRight: 10}}>Undo</span>
                                    <Icon 
                                        link
                                        name="delete"
                                        color="red"
                                        onClick={() => this.deleteTask(index)}
                                    />
                                    <span style={{ paddingRight: 10 }}>Delete</span>
                                </Card.Meta>
                            </Card.Content>
                        </Card>
                    );
                })
            });
        }
    };

    // Update the task status to true
    updateTask = index => {

        // Get the task list from the local storage
        let tasklist = JSON.parse(localStorage.getItem("tasklist"));

        // Change status to true
        tasklist[index].status = true;

        // Save the updated task list
        localStorage.setItem("tasklist", JSON.stringify(tasklist));
        
        // Refresh the task list
        this.getTasks();
    };

    // Undone the task status from true to false
    undoTask = index => {

        // Get the task list from the local storage
        let tasklist = JSON.parse(localStorage.getItem("tasklist"));

        // Change status to false
        tasklist[index].status = false;

        // Svae the updated task list
        localStorage.setItem("tasklist", JSON.stringify(tasklist));

        // Refresh the task list
        this.getTasks();
    };

    // Delete the task from the task list
    deleteTask = index => {

        // Get the task list from the local storage
        let tasklist = JSON.parse(localStorage.getItem("tasklist"));

        // Remove the task from the task list
        tasklist.splice(index, 1);

        // Save the updated task list
        localStorage.setItem("tasklist", JSON.stringify(tasklist));

        // Refresh the task list
        this.getTasks();
    };

    render() {
        return (
            <div>
                <div>
                    <Header as="h1">
                        <div className="app-header">? My Task List</div>{" "}
                    </Header>
                </div>
                <div className="app-form">
                    <Form onSubmit={this.onSubmit}>
                        <Input
                            type="text"
                            name="task"
                            onChange={this.onChange}
                            value={this.state.task}
                            fluid
                            placeholder="task...."
                        />
                    </Form>
                </div>
                <div>
                    <Card.Group>{this.state.tasklist}</Card.Group>
                </div>
            </div>
        );
    }
}

export default MyTaskList;