<?php

function dbConnect()
{
    $serverName = 'postgresql';
    $uName = 'gisteam';
    $pWord = 'gisDB1';
    $db = 'external';
    
    try
    {
        //instantiate a PDO object and set connection properties
        
        $conn = new PDO("pgsql:host=$serverName;port=5432;dbname=$db;user=$uName;password=$pWord");
        
        //return connection object

        return $conn;
    }
    // if connection fails
    
    catch (PDOException $e)
    {
        die('Connection failed: ' . $e->getMessage());
    }
}


function getIncomeGrp()
{
//    $postdata = file_get_contents("php://input");
//    $industryRequest = json_decode($postdata);
//    $measure = $industryRequest->measure->name;
//    $area = $industryRequest->area;
    
    
    
    
   
    //add areaName to new array
   
    
    //$measureName = array('measure' => 'crude oil production');
    $conn = dbConnect();
    
    $sqlCmd = <<< sql
            select distinct income_grp from aaa_income order by income_grp
sql;
    
    $stmt = $conn->query($sqlCmd);    
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
    

            
}

getIncomeGrp();