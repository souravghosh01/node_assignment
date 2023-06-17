const genCode = (errMsg) =>{
    if (errMsg.includes('required') || errMsg.includes('valid') || errMsg.includes('least')) {
        return 'INVALID_INPUT';
      } else if (errMsg.includes('exists') || errMsg.includes('already')) {
        return 'RESOURCE_EXISTS';
      } else if (errMsg.includes('not found')) {
        return 'RESOURCE_NOT_FOUND';
      } else {
        return 'UNKNOWN_ERROR';
      }
}

module.exports = genCode