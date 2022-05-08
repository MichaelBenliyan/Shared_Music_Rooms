import React, { Component } from "react"; 
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core"
import { 
    BrowserRouter as Router, 
    Switch, 
    Route, 
    Link, 
    Redirect 
} from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        };
        this.clearRoomCode = this.clearRoomCode.bind(this);
    }
    // Life Cycle Method (there are multiple others)
    async componentDidMount() {
        // this is going to return whether or not we are in a room and if we are in a room we will get that room code
        fetch('/api/user-in-room')
        //then get the JSON from our response
            .then((response) => response.json())
        //then we can parse and look through our json object and get the room code
            .then((data) => {
            //set state will force room to rerender. So Basically on the first run will show us homepage then reload
                this.setState({
                    roomCode: data.code,
                });
            });
    }



    renderHomePage() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align = "center">
                    <Typography variant="h3" compact="h3">
                        Music Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align = "center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to='/join' component={Link}>
                            Join a Room
                        </Button>
                        <Button color="secondary" to='/create' component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    clearRoomCode() {
        this.setState({
            roomCode: null,
        });
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route 
                        exact path='/' 
                        render={() => {
                            // if we have a room code 
                            return this.state.roomCode ? (
                                //redierect to this
                                <Redirect to={`/room/${this.state.roomCode}`}/>
                            //else
                            ) : ( 
                                //render homepage
                                this.renderHomePage() 
                            );
                        }}
                    />
                    <Route path='/join' component={RoomJoinPage}/>
                    <Route path='/create' component={CreateRoomPage}/>
                    <Route 
                        path="/room/:roomCode" 
                        render={(props) => {
                            return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
                        }}
                    />
                </Switch>
            </Router>
        );
    }
}