import express from "express";
import cors from "cors";

import jiraData from "./data/jiraData.js";
import prData from "./data/prData.js";
import deploymentData from "./data/deploymentData.js";
import bugData from "./data/bugData.js";

const app = express();
app.use(cors());

app.get("/metrics", (req, res) => {
    
    const { developer, month } = req.query;
    
    const issues = jiraData.filter( d => d.developer_id === developer && d.month === month );
    
    const pr = prData.filter( d => d.developer_id === developer && d.month === month);
    
    const deployment = deploymentData.filter(d => d.developer_id === developer && d.month === month);
    
    const bug = bugData.filter( d => d.developer_id === developer && d.month === month && d.escaped === true);
    console.log(bug);
    
    
    const cycleTime = issues.reduce((s, i) => s + i.cycle_time_days, 0) /(issues.length || 1);
    
    const leadTime = deployment.reduce((s, i) => s + i.lead_time_days, 0) /(deployment.length || 1);
    
    const deployCount = deployment.length;
    const bugRate = (bug.length / (issues.length || 1)) * 100;
    const prCount = pr.length;
    const insights = [];
    const suggestions = [];
    
    if (bugRate > 20) {
        insights.push("High bug rate — quality issue");
        suggestions.push("Improve testing before release");
    } else if (bugRate > 0) {
        insights.push("Moderate bug rate — monitor quality");
    } else {
        insights.push("Excellent quality — no bugs");
    }

    
    if (cycleTime > 5) {
        insights.push(" Work taking longer than expected");
        suggestions.push("Break tasks into smaller tickets");
    } else if (cycleTime > 3) {
        insights.push("Cycle time is acceptable");
    } else {
        insights.push("Fast development speed");
    }

    if (leadTime > 4) {
        insights.push("Delay in reaching production");
        suggestions.push("Reduce PR size or speed up reviews");
    } else if (leadTime > 2) {
        insights.push("Lead time is reasonable");
    } else {
        insights.push("Fast delivery to production");
    }

    if (deployCount < 2) {
        insights.push("Low deployment frequency");
        suggestions.push("Increase deployment frequency");
    } else if (deployCount <= 4) {
        insights.push("Deployment frequency is good");
    } else {
        insights.push("High deployment frequency");
    }
    
    if (prCount < 2) {
        insights.push("Low PR throughput");
        suggestions.push("Increase smaller PRs");
    } else if (prCount <= 4) {
        insights.push("PR flow is steady");
    } else {
        insights.push("Too many small PRs");
        suggestions.push("Combine related changes");
    }

    res.json({
        developer,
        month,
        leadTime: Number(leadTime.toFixed(1)),
        cycleTime: Number(cycleTime.toFixed(1)),
        prCount,
        deployCount,
        bugRate,
        insights,
        suggestions
    });
});

app.listen(4000, () => console.log("Server running on 4000"));