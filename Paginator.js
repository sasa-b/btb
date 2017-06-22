/**
 * Created by sasablagojevic on 3/7/17.
 */
function Paginator(config) {
    var self = this;
    this.paginationId = 'pagination';
    var totalPages = 0;
    this.rowsPerPage = 10;
    var offset = 0;
    var totalRows = 0;
    var page = 1;
    this.pagesLimit = 5;
    this.parent = '';
    this.clickEvent = null;
    this.className = 'pagination';

    /*Setters*/
    var setTotalPages = function (rows) {
        totalPages = Math.ceil(rows / self.rowsPerPage);
    }

    this.setTotalRows = function (rows) {
        rows = parseInt(rows)
        console.log('Total rows:'+rows)
        totalRows = rows;
        setTotalPages(rows);
    }

    var setOffset = function(page) {
        offset = (page - 1) * self.rowsPerPage;
    }

    this.setPage = function(no) {
        no = parseInt(no);

        if (no < 1) {
            no = 1;
        }
        if (totalPages !== 0 && no > totalPages) {
            no = totalPages;
        }
        page = no;
        setOffset(page);
    }

    /*Getters*/
    this.getTotalRows = function () {
        return totalRows;
    }

    this.getRowsPerPage = function() {
        return this.rowsPerPage;
    }

    this.getPage = function () {
        return page;
    }

    this.getTotalPages = function () {
        return totalPages;
    }

    this.getOffset = function () {
        return offset;
    }

    this.createLinks = function (clickEvent) {
        var ul = document.createElement('ul');
        ul.setAttribute('id', this.paginationId);
        ul.className = this.className;

        console.log('Total pages:'+totalPages);
        console.log('Limit:'+this.pagesLimit);

        if (totalPages > 1) {

            var previous = document.createElement('li');
            previous.innerHTML = '<a id="previous" href="#" aria-label="Previous"><i class="fa fa-angle-left"></i></a>';

            ul.appendChild(previous);

            var limit = this.pagesLimit;

            if (limit >= totalPages) {

                for (var i = 1; i <= totalPages; i++) {
                    var li = document.createElement('li');
                    li.innerHTML = '<a id="pg-'+i+'" href="#"'+(i == page ? 'class="active"' : '')+'>'+i+'</a>';
                    ul.appendChild(li);
                }

            } else {

                if (page < limit) {

                    for (var i = 1; i <= limit; i++) {
                        var li = document.createElement('li');
                        li.innerHTML = '<a id="pg-'+i+'" href="#"'+(i == page ? 'class="active"' : '')+'>'+i+'</a>';
                        ul.appendChild(li);
                    }

                    if (limit < totalPages) {
                        var li = document.createElement('li');
                        li.innerHTML = '<a href="javascript:void(0)" data-disabled="1" disabled>...</a>';
                        var lastPage = document.createElement('li');
                        lastPage.innerHTML = '<a id="pg-'+totalPages+'" href="#"'+totalPages+'>'+totalPages+'</a>';
                        ul.appendChild(li);
                        ul.appendChild(lastPage);
                    }

                }

                if (page >= limit) {

                    var start = page - ((limit - 3) / 2);
                    start = start < 1 ?  1 : start;
                    var end = page + ((limit - 3) / 2);
                    end = end > totalPages ? totalPages : end;

                    if (page + limit - 1 > totalPages) {
                        start = totalPages - limit + 1;
                        end = totalPages;
                    }

                    var li = document.createElement('li');
                    li.innerHTML = '<a href="javascript:void(0)" data-disabled="1" disabled>...</a>';
                    var firstPage = document.createElement('li');
                    firstPage.innerHTML = '<a id="pg-1" href="#">1</a>';
                    ul.appendChild(firstPage);
                    ul.appendChild(li);

                    for (var i = start; i <= end; i++) {
                        var li = document.createElement('li');
                        li.innerHTML = '<a id="pg-'+i+'" href="#"'+(i == page ? 'class="active"' : '')+'>'+i+'</a>';
                        ul.appendChild(li);
                    }

                    if (page + limit - 1 <= totalPages) {
                        var li = document.createElement('li');
                        li.innerHTML = '<a href="javascript:void(0)" data-disabled="1" disabled>...</a>';
                        var lastPage = document.createElement('li');
                        lastPage.innerHTML = '<a id="pg-'+totalPages+'" href="#"'+totalPages+'>'+totalPages+'</a>';
                        ul.appendChild(li);
                        ul.appendChild(lastPage);
                    }

                }

            }


            var next = document.createElement('li');
            next.innerHTML = '<a id="next" href="#" aria-label="Next"><i class="fa fa-angle-right"></i></a>';
            ul.appendChild(next);

        } else {

            var previous = document.createElement('li');
            previous.innerHTML = '<a href="javascript:void(0)" aria-label="Previous" data-disabled="1" disabled=""><i class="fa fa-angle-left"></i></a>';

            var disabled = document.createElement('li');
            disabled.innerHTML = '<a href="javascript:void(0)" data-disabled="1" disabled>...</a>';

            var next = document.createElement('li');
            next.innerHTML = '<a href="javascript:void(0)" aria-label="Next" data-disabled="1" disabled><i class="fa fa-angle-right"></i></a>';

            ul.appendChild(previous);
            ul.appendChild(disabled);
            ul.appendChild(next);
        }

        if (this.parent != '' && this.parent != null) {

            var pagination = document.getElementById(this.paginationId);
            if (pagination) {
                pagination.parentNode.removeChild(pagination)
            }

            if (typeof this.parent !== 'string') {
                this.parent.appendChild(ul);
            } else {
                document.querySelector(this.parent).appendChild(ul);
            }
            this.attachEvents(typeof clickEvent !== 'undefined' ? clickEvent : (this.clickEvent ? this.clickEvent : undefined));

        }

        return ul.outerHTML;
    }

    /**
     * Attach pagination click events
     * @param clickEventCallback function
     */
    this.attachEvents = function (clickEventCallback) {
        var ul = document.getElementById(this.paginationId);
        if (ul) {
            var links = Array.prototype.slice.call(ul.children);
            links.forEach(function (link) {
                link.firstChild.addEventListener('click', function (e) {
                    e.preventDefault();

                    if (this.dataset.disabled == 1) {
                        return false;
                    }

                    if (this.className.indexOf('active') > -1) {
                        return false;
                    }

                    var id = this.getAttribute('id');

                    if (id === 'next') {

                        if (self.getPage() + 1 > self.getTotalPages()) {
                            return false;
                        }
                        self.setPage(self.getPage() + 1);


                    } else if (id == 'previous') {

                        if ((self.getPage() - 1) < 1) {
                            return false;
                        }

                        self.setPage(self.getPage() - 1);

                    } else {
                        self.setPage(parseInt(this.innerHTML));
                    }

                    if (typeof clickEventCallback !== 'undefined') {
                        clickEventCallback(self);
                    }

                });
            })
        }
    }

    var __construct = function(config) {
        if (typeof config !== 'undefined') {
            for (var key in config) {
                if (key === 'totalRows') {
                    self.setTotalRows(config[key]);
                } else if (self.hasOwnProperty(key)){
                    self[key] = config[key];
                }
            }
        }
    }(config);

}