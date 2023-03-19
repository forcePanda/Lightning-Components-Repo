# LWC SOQL Util
This is a utility Lightning Web Component that allows you to query data without having to create a dedicated Apex class.

This utility exposes the following objects and methods:
| Name | Type | Description |
|-|-|-|
| query | Method | Use this method to run SOQL queries. |
| ACCESS_LEVEL | Object | The object has 2 access levels that can be specified when using the query method. Read the **How to use** section for more information.|


## Installation
| Version | Fixes |Package Link*	    
|-|-|-|
| 1.0 | Base Version | https://test.salesforce.com/packaging/installPackage.apexp?p0=04t6F000004HDswQAG |

*To install the package in Production, replace test.salesforce.com with login.salesforce.com in the package link.

## How to use
You can use this utility by importing it in your LWC. For example:

```
import * as soqlUtil from 'c/soqlUtil';
```

#### Query method usage
| Method Name | Syntax | Return type | Description |
|-|-|-|-|
| query | query(String query) | Promise | Method to execute SQOL. By default, the query runs in USER_MODE |
| query | query(String query, Object queryVariables) | Promise | Method to execute SQOL with bind variables. By default, the query runs in USER_MODE. |
| query | query(String query, Object queryVariables, String accessLevel) | Promise | Method to execute SQOL with bind variables with a specified access level. |



**Simple SOQL query snippet**
```
import { LightningElement } from 'lwc';
import * as soqlUtil from 'c/soqlUtil';

export default class Demo extends LightningElement {

    query() {
        soqlUtil.query(
            'SELECT Id,Name FROM Account'
        )
        .then(result => console.log(result))
        .catch(err => console.error(err));
    }
}
```

**Simple SOQL query in System Mode snippet**
```
import { LightningElement } from 'lwc';
import * as soqlUtil from 'c/soqlUtil';

export default class Demo extends LightningElement {

    query() {
        soqlUtil.query(
            'SELECT Id,Name FROM Account',
            {},
            soqlUtil.ACCESS_LEVEL.SYSTEM_MODE
        )
        .then(result => console.log(result))
        .catch(err => console.error(err));
    }
}
```

**SQOL with Bind variables**
```
import { LightningElement } from 'lwc';
import * as soqlUtil from 'c/soqlUtil';

export default class Demo extends LightningElement {

    query() {
        soqlUtil.query(
            'SELECT Id,Name FROM Account Rating = :rating'
            , {
                rating : 'Hot'
            }
        )
        .then(result => console.log(JSON.stringify(result)))
        .catch(err => console.error(err));
    }
}
```
**SQOL with Bind variables in System Mode**
```
import { LightningElement } from 'lwc';
import * as soqlUtil from 'c/soqlUtil';

export default class Demo extends LightningElement {

    query() {
        soqlUtil.query(
            'SELECT Id,Name FROM Account Rating = :rating'
            , {
                rating : 'Hot'
            },
            soqlUtil.ACCESS_LEVEL.SYSTEM_MODE
        )
        .then(result => console.log(JSON.stringify(result)))
        .catch(err => console.error(err));
    }
}
```