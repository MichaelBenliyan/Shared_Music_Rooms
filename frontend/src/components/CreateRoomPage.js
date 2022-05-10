import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel} from "@material-ui/core";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert"

export default class CreateRoomPage extends Component {
    static defaultProps= {
        votesToSkip: 2, 
        guestCanPause: true, 
        update: false, 
        roomCode: null, 
        updateCallback: () => {},
    }


    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause, 
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg: "",
        };
        // binds the method to the class. this allows access to the 'this' keyword
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.renderCreateButtons = this.renderCreateButtons.bind(this);
        this.renderUpdateButtons = this.renderUpdateButtons.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
    }
    // e is the object that called the function
    handleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value,
        })
    }
    handleGuestCanPauseChange(e) {
        this.setState({
            guestCanPause: e.target.value === 'true' ? true : false,
        })
    }
    handleRoomButtonPressed() {
        const requestOptions = {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            // can pass a javascript object to be converted into a JSON string
            body: JSON.stringify({
                // following field names need to match what we're looking for in the server
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            }),
        };
        // i wanna send a request to local host api/create-room || going to send it with the request option || 
        // the .then is saying once we get a response lets take that response and convert that response into JSON 
        // || then lets take the data and do something with the data
        fetch('/api/create-room', requestOptions)
            .then((response) => response.json())
            .then((data) => this.props.history.push('/room/' + data.code));
    }

    handleUpdateButtonPressed() {
        const requestOptions = {
            method: 'PATCH', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode
            }),
        };
        fetch('/api/update-room', requestOptions)
            .then((response) => {
                if(response.ok) {
                    this.setState({
                        successMsg: "Room updated successfully!"
                    });
                } else {
                    this.setState({
                        errorMsg: "Error updating room..."
                    });
                }
            this.props.updateCallback();
            // we put ^ here and not after because we want to make sure the .thens are finished and then we call it 
        });

    }

    renderCreateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleRoomButtonPressed} >
                        Create A Room
                    </Button>
                </Grid>
                    <Grid item xs={12} align="center">
                        <Button color="secondary" variant="contained" to="/" component={Link}>
                            Back
                        </Button>
                </Grid>
            </Grid>
        );
    }

    renderUpdateButtons() {
        return (
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleUpdateButtonPressed} >
                    Update Room
                </Button>
            </Grid> 
        );
    }



    render() {
        const title = this.props.update ? "Update Room" : "Create a Room"
        // spacing is 1 = 8px
        return(
            <Grid container spacing={1} align="center">
                <Grid item xs={12} align="center">
                    {/* if what is in the in={} is true, it will show, else not */}
                    <Collapse in={this.state.errorMsg != "" || this.state.successMsg != ""}>
                        {this.state.successMsg != "" ? (
                            <Alert 
                                severity="success" 
                                onClose={() => {
                                    this.setState({successMsg: ""});
                                }}
                            >
                                {this.state.successMsg}
                            </Alert>
                        ) : (
                            <Alert 
                                severity="error"
                                onClose={()=> {
                                    this.setState({errorMsg: ""});
                                }}
                            >
                                {this.state.errorMsg}
                            </Alert>)
                        }
                    </Collapse>
                </Grid>
                {/* xs, can also have s m l etc, tells us what the width should be when the size of the window is xs, etc... 12 is the maximum value you can put for the value. */}
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4" style={{color: 'white'}}>
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center" style={{color: 'white'}}>
                                Guest Control Of Playback
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleGuestCanPauseChange}>
                            <FormControlLabel 
                                value ='true' 
                                control={<Radio color='primary' style={{color: 'white'}}/>}
                                label="Play/Pause"
                                lavelPlacement="bottom" 
                                style={{color: 'white'}}
                            />
                            <FormControlLabel 
                                value ='false' 
                                control={<Radio color='secondary' style={{color: 'white'}}/>}
                                label="No Control"
                                lavelPlacement="bottom" 
                                style={{color: 'white'}}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField
                            required={true} 
                            type="number" 
                            onChange={this.handleVotesChange}
                            defaultValue={this.state.votesToSkip}
                            inputProps={{
                                min: 1,
                                style: { textAlign: 'center', color: "white" } 
                            }}
                        />
                        <FormHelperText>
                            <div align="center" style={{color: 'white'}}>
                                Votes Required To Skip Song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
            </Grid>
        );
    }
}