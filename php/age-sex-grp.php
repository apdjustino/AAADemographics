<?php

function dbConnect()
{
    $serverName = '10.0.1.242';
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


function getAgeSex()
{
//    $postdata = file_get_contents("php://input");
//    $industryRequest = json_decode($postdata);
//    $measure = $industryRequest->measure->name;
//    $area = $industryRequest->area;
    
    
    
    
   
    //add areaName to new array
   
    
    //$measureName = array('measure' => 'crude oil production');
    $conn = dbConnect();
    
    $sqlCmd = <<< sql
            select distinct age_sex_grp from aaa_demographics order by age_sex_grp
sql;
    
    $stmt = $conn->query($sqlCmd);    
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
    

            
}

getAgeSex();