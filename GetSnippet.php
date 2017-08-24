<?php
    include('./simple_html_dom.php');
    if(isset($_GET['file'])) { 
        $file = file_get_html("./LATimesDownloadData/".$_GET['file']);
        $body = $file->plaintext;

        $query_terms = preg_split("/\s+/", $_GET['qs']);
        //$sentences = preg_split('/[.]/', $des)
        $fragmented = explode(".", $body);
        $desc = "";

        while (($statement = next($fragmented)) !== NULL) {
            echo $statement;
            echo  $_GET['qs'];
            if (strpos(strtolower($statement), strtolower($_GET['qs'])) !== false) {
                       //echo $statement;
                       $desc = $desc . $statement;
                            break;
                    }
        }

    }

    if (strlen($desc) > 160) {
        $desc = substr($desc, 0, 160) . "...";
    }
    echo $desc;
?>