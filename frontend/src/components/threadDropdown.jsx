import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function ThreadDropdown({selectedOption, onSelectedOptionChange}){
    const [threadNames, setThreadNames] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/threads/allthreadnames').then(res => {
            res.json().then(names => {
                setThreadNames(names);
            });
        });
    }, []);

    return(
        <Box sx={{ maxWidth: 200, marginTop: "10px"}}>
            <FormControl sx={{width: "100%"}} size="small">
                <InputLabel id="demo-simple-select-label">Available Threads</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedOption}
                    onChange={onSelectedOptionChange}
                    defaultValue=""
                    >
                    <MenuItem value="">None</MenuItem>
                    {
                        threadNames.map((item) => {
                            return(<MenuItem key={item._id} value={item.threadname}>{item.threadname}</MenuItem>);
                        })
                    }
                    </Select>
            </FormControl>
        </Box>
    );  
}

export default ThreadDropdown;