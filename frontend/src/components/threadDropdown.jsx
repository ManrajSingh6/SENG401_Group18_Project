import React, { useState } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function ThreadDropdown({value, onChange}){
    return(
        <Box sx={{ maxWidth: 200, marginTop: "10px"}}>
            <FormControl sx={{width: "100%"}} size="small">
                <InputLabel id="demo-simple-select-label">Available Threads</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    onChange={onChange}
                    defaultValue={""}
                    >
                        <MenuItem value={"Cars and Automobiles"}>Cars and Automobiles</MenuItem>
                        <MenuItem value={"Technology"}>Technology</MenuItem>
                        <MenuItem value={"Food"}>Food</MenuItem>
                        <MenuItem value={"Health"}>Health</MenuItem>
                    </Select>
            </FormControl>
        </Box>
    );  
}

export default ThreadDropdown;