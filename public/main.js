$(document).ready(function()
{
    $('.deleteUser').on('click', deleteUser);
});

function deleteUser()
{
    var conf = confirm("Delete?")
    if (confirm)
    {
        alert(1);
        console.log("Delete")
    }
}