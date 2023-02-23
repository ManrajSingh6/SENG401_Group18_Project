import React, { useState } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Dropdown(){

    const [filterChoice, setFilterChoice] = useState('');

    function handleChange(event) {
        event.preventDefault();
        // UPDATE CODE WHEN REQUIRED
        setFilterChoice(event.target.value);
    }
    return(
    <Box sx={{ maxWidth: 150, width: "50%"}}>
        <FormControl sx={{width: "100%"}} size="small">
            <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterChoice}
                onChange={handleChange}
                >
                    <MenuItem value={"Likes"}>Most Likes</MenuItem>
                    <MenuItem value={"Comments"}>Most Comments</MenuItem>
                    <MenuItem value={"Recent"}>Most Recent</MenuItem>
                </Select>
        </FormControl>
    </Box>




    );  
}

export default Dropdown;