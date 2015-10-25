<?php 

require_once('TwitterAPIExchange.php');

/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
$settings = array(
    'oauth_access_token' => "Your Access token here",
    'oauth_access_token_secret' => "Your access token secret here",
    'consumer_key' => "Your consumer key here",
    'consumer_secret' => "Your consumer secret here"
);
$q = $_REQUEST['q'];
$lat = $_REQUEST['lat'];
$lon = $_REQUEST['lon'];
$rad = $_REQUEST['rad'];
$url = 'https://api.twitter.com/1.1/search/tweets.json';
if($q!=""){
	$getfield = '?q='.$q.'&count=100&result_type=recent&lang=en&geocode='.$lat.','.$lon.','.$rad.'mi';
}
else{
	$getfield = '?q=&count=100&result_type=recent&lang=en&geocode='.$lat.','.$lon.','.$rad.'mi';
}

$requestMethod = 'GET';
$twitter = new TwitterAPIExchange($settings);
$response =  $twitter->setGetfield($getfield)
    ->buildOauth($url, $requestMethod)
    ->performRequest();

echo $response;

 ?>
