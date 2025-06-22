<?php
class Database {
    private $host = 'eks-tree-rds.ch2c82wwifaa.us-east-1.rds.amazonaws.com';
    private $db_name = 'community_energy_connect';
    private $username = 'admin';
    private $password = 'khaleeda';
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                                  $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
