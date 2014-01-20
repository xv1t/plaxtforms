
/*
types:
simple: if values set then by template

*/
function readConditions (container, options) {
  _cond = []
  $(container).find('[c-filter]').each(function(ix, obj){
    queryTemplate=$(obj).attr('c-query');
    value=$(obj).val();
    cType=($(obj).attr('c-type')) ? $(obj).attr('c-type') : 'simple';
    switch(cType){
      case('simple'):
        /*
        <input type="text" c-query="Model.field LIKE '{value}'">
        */
        if (value) 
          _cond.push(queryTemplate.replace('{value}', value))
        break;
      case('select'): 
        /*
        <select c-type="switch" c-query="Model.remote_id={value}">
          <option c-query="Model.field IS TRUE">empty</option>
          <option value='n' c-query="Model.field IS TRUE AND Model.field2>100">My option</option>
          <option value='y' c-query="NOT Model.field AND Model.field2<100">My option2</option>  
        </select>
        */
        break;
    }
  })
  return _cond;
  }
