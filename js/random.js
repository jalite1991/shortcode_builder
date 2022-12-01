/**
 * Created by jfloyd on 3/29/17.
 */
(function ($, Drupal) {

    list = [
        {
            id: 1,
            title: 'home',
            parent: null
        },
        {
            id: 2,
            title: 'about',
            parent: null
        },
        {
            id: 3,
            title: 'team',
            parent: 2
        },
        {
            id: 4,
            title: 'company',
            parent: 2
        },
        {
            id: 4,
            title: 'company2',
            parent: 1
        }
    ]

    function treeify(list, idAttr, parentAttr, childrenAttr) {
        if (!idAttr) idAttr = 'id';
        if (!parentAttr) parentAttr = 'parent';
        if (!childrenAttr) childrenAttr = 'children';
        var treeList = [];
        var lookup = {};
        list.forEach(function(obj) {
            lookup[obj[idAttr]] = obj;
            obj[childrenAttr] = [];
        });
        list.forEach(function(obj) {
            if (obj[parentAttr] != null) {
                lookup[obj[parentAttr]][childrenAttr].push(obj);
            } else {
                treeList.push(obj);
            }
        });
        return treeList;
    };

    var tree = treeify(list);

    console.log(tree);

})(jQuery, Drupal);