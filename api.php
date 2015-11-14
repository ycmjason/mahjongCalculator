#!/usr/bin/php
<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST))
      $_POST = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'];

Class Collection{
  protected $records;
  private $filepath;

  public function __construct($filepath){
    $this->filepath = $filepath;
    $this->records = json_decode(file_get_contents($filepath), true);
    if($this->records === null) $this->records = array();
  }

  public function get($id){
    if(!is_numeric($id)){
      return null;
    }
    $filtered = array_filter($this->records, function($record) use($id) {
      return $record['id'] === intval($id);
    });
    $record = current($filtered);
    return $record;
  }

  public function getAll(){
    return $this->records;
  }

  //updatedRecord must has all fields
  public function update($updatedRecord){
    foreach($this->records as &$record){
      if($record['id']===$updatedRecord['id']){
        $record = $updatedRecord;
      }
    }
    $this->save();
  }

  protected function save(){
    return file_put_contents($this->filepath, json_encode($this->records), LOCK_EX);
  }
}

Class PeopleCollection extends Collection{
  public function getAllWithoutCredentials(){
    return array_map(array($this, "removeCredentials") ,$this->getAll());
  }
  public function getWithoutCredentials($id){
    return $this->removeCredentials($this->get($id));
  }
  private function removeCredentials($person){
    unset($person['password']);
    return $person;
  }
  public function add($name, $facebook, $image){
    $lastRecord = end($this->records);
    $lastId = $lastRecord['id'];
    $newRecord = array(
      "id" => $lastId+1,
      "name" => $name,
      "facebook" => $facebook,
      "image" => $image,
      "password"=> ""
    );
    array_push($this->records, $newRecord);
    $this->save();
  }
}

Class AllocationsCollection extends Collection{
  public function add($id, $targetId){
    $newRecord = array(
      "id" => intval($id),
      "target_id" => intval($targetId)
    );
    array_push($this->records, $newRecord);

    //save the updated records
    $this->save();
  }
}

$people= new PeopleCollection('./database/people.json');
$allocations = new AllocationsCollection('./database/allocations.json');

function echoJson($record){
  echo json_encode($record);
}

function checkRequiredPostParams($names){
  $hasAllParams =array_reduce(
    array_map(function($name){
      return $_POST[$name]!==null && $_POST[$name]!=="";
    }, $names),
    function($b, $b2){
      return $b && $b2;
    },
    true
  );
  if(!$hasAllParams){
    die("Please fill in the missing fields.");
    /*$params = "[".array_reduce($names, function($n, $n2){
      return $n." ".$n2;
    })." ]";
    die("Please provide the valid params. Required: ".$params);*/
  }
  return true;
}

function getTarget($id){
  global $people,$allocations;
  $allocation = $allocations->get($id);
  return $people->getWithoutCredentials($allocation['target_id']);
}

switch($action){
  case 'getPeople':
    echoJson($people->getAllWithoutCredentials());
    break;
  case 'getPerson':
    if(!checkRequiredPostParams(array("id"))) break;

    echoJson($people->getWithoutCredentials($_POST['id']));
    break;
  case 'getTarget':
    if(!checkRequiredPostParams(array("id", "password", "confirm"))) break;
    $id = $_POST['id'];

    if(!$_POST['confirm']){
      die("Please confirm you are the person him/herself");
    }

    // check if password match
    $password = md5($_POST['password']);
    $target_profile_with_credentials = $people->get($id);
    $expectedPassword = $target_profile_with_credentials['password'];
    if($password !== $expectedPassword){
      die("Failed matching password.");
    }

    // fetch target
    $target = getTarget($id);
    if($target==null){
      die("No allocation found.");
    }

    // return profile
    echoJson($target);
    break;
  case 'addPerson':
    if(!checkRequiredPostParams(array("name", "facebook", "image"))) break;
    $name = $_POST['name'];
    $facebook = $_POST['facebook'];
    $image = $_POST['image'];
    $people->add($name, $facebook, $image);
    break;
  case 'setPassword':
    if(!checkRequiredPostParams(array("id", "password"))) break;
    $id = $_POST['id'];
    $password = md5($_POST['password']);

    $person = $people->get($id);
    if($person == null){
      die("Person not found.");
    }
    
    if($person['password'] != null){
      die("Password has been set and cannot be reset.");
    }

    $person['password'] = $password;
    $people->update($person);
    echoJson($people->getWithoutCredentials($id));

    break;
  case 'allocate':
    if(!checkRequiredPostParams(array("id"))) break;
    $id = $_POST['id'];

    //check if allocation already exist
    if($allocations->get($id) != null){
      die("Allocation has been done.");
    }

    //get a list of untargeted targets(people)
    $everyone = $people->getAllWithoutCredentials();
    $targeted_id_list = array_map(function($allocation){
      return $allocation['target_id'];
    }, $allocations->getAll());
    $untargeted_list = array_filter($everyone, function($person) use($targeted_id_list, $id){
      return !in_array($person['id'], $targeted_id_list) && $id!=$person['id']; // make sure that santa is deleted
    });

    //shuffle the list
    shuffle($untargeted_list);

    $target_person = current($untargeted_list);

    //make sure no loop is made until the last person
    if(count($untargeted_list)>1){
      $person_pointer = $target_person;
      while(($person_pointer = getTarget($person_pointer['id']))!=null){
        if($person_pointer['id']==$id){
          $target_person=next($untargeted_list);
          $person_pointer=$target_person;
        }
      }
    }

    $allocations->add($id, $target_person['id']);

    break;
  case 'showAlloc':
    $countingArray=array();
    $peopleCount = count($people->getAll());
    do{
      echo "=============================\n";
      for($i=0; $i<$peopleCount; $i++){
        if(!in_array($i, $countingArray)){
          $first = $people->getWithoutCredentials($i);
          break;
        }
      }
      $current = $first;
      do{
        print_r($current);
        array_push($countingArray, $current['id']);
      }while(($current=getTarget($current['id']))!=$first);
    }while(count($countingArray)<$peopleCount);
    break;
}
?>
