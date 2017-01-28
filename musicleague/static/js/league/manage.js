
// Initialize league member search autocomplete
$('#search').bootcomplete({
    url: '{{ url_for("autocomplete") }}',
    method: 'post',
    minLength: 3
});

// Initialize league round add datetime pickers
function initializeDatePicker(elementId) {
    return $(elementId).datetimepicker({
        sideBySide: true,
        format: 'MM/DD/YY hA',
        useStrict: true,
        showClose: true
    });
};
initializeDatePicker('#submission-due-date').on("dp.change", function(e) {
    $('#submission-due-date-utc').val(moment(e.date.utc()).format('MM/DD/YY hA'));
    $('#voting-due-date').data("DateTimePicker").minDate(e.date.add(1, 'hours').toDate());
});
initializeDatePicker('#voting-due-date').on("dp.change", function(e) {
    $('#voting-due-date-utc').val(moment(e.date.utc()).format('MM/DD/YY hA'));
});

// Process submission for manage league form
function collectAddedMembers() {
    var members = [];
    $('#added-members .added-member').each(function() {
        members.push(String($(this).data('id')));
    });
    var jsonField = $(document.getElementById('added-members-inp'));
    jsonField.val(JSON.stringify(members));
};

function collectInvitedMembers() {
    var invited = [];
    $('#added-members .invited-member').each(function() {
        invited.push(String($(this).data('email')));
    });
    var jsonField = $(document.getElementById('invited-members-inp'));
    jsonField.val(JSON.stringify(invited));
};

function collectAddedRounds() {
    var rounds = [];
    $('#added-rounds .added-round').each(function() {
        rounds.push(
            {
                'name': $(this).data('name'),
                'description': $(this).data('description'),
                'submission-due-date-utc': $(this).data('submission-due-date-utc'),
                'voting-due-date-utc': $(this).data('voting-due-date-utc')
            }
        );
    });
    var jsonField = $(document.getElementById('added-rounds-inp'));
    jsonField.val(JSON.stringify(rounds));
};

function processFormSubmission() {
    collectAddedMembers();
    collectInvitedMembers();
    collectAddedRounds();
    return true;
};

// Add invited member
function inviteMember() {
    var email = $('#email').val();
    $('#added-members').append(
        '<span class="invited-member" data-email="'+email+'">'+email+'</span>'
    );
    $('#email').val("");

    $('#league-members').trigger('contentchanged');
};

// Add round to league on button click
function addRound() {
    var roundName = $('#round-name').val();
    var roundDescription = $('#round-description').val();
    var submissionDueDate = $('#submission-due-date-utc').val();
    var votingDueDate = $('#voting-due-date-utc').val();
    $('#added-rounds').append(
        '<span class="added-round" data-name="'+roundName+'" data-description="'+roundDescription+'" data-submission-due-date-utc="'+submissionDueDate+'" data-voting-due-date-utc="'+votingDueDate+'">'+roundName+'</span>'
    );
    $('#league-rounds-save-warning').slideDown();

    $('#league-rounds input, #league-rounds textarea').val("");
    $('#round-name').focus();

    var nextSubmissionDueDate = moment.utc(submissionDueDate, "MM/DD/YY hA").add(7, 'days');
    $('#submission-due-date').val(moment(nextSubmissionDueDate.toDate()).format('MM/DD/YY hA'));
    var nextVotingDueDate = moment.utc(votingDueDate, "MM/DD/YY hA").add(7, 'days');
    $('#voting-due-date').val(moment(nextVotingDueDate.toDate()).format('MM/DD/YY hA'));
    $('#submission-due-date, #voting-due-date').trigger('dp.change');

    $('#league-rounds').trigger('contentchanged');
};

// Handle edit round modal on button click
function editRound() {
    var round = $(this).parent();
    var id = round.data('id');
    var name = round.data('name');
    var description = round.data('description');
    var submissionDueDateUTC = round.data('submission-due-date-utc');
    var submissionDueDate = moment.utc(submissionDueDateUTC, "MM/DD/YY hA").toDate();
    var votingDueDateUTC = round.data('voting-due-date-utc');
    var votingDueDate = moment.utc(votingDueDateUTC, "MM/DD/YY hA").toDate();

    var modal = $('#edit-round-modal');
    modal.find('#edit-id').val(id);
    modal.find('#edit-name').val(name);
    modal.find('#edit-description').val(description);
    modal.find('#edit-submission-due-date').val(moment(submissionDueDate).format('MM/DD/YY hA'));
    modal.find('#edit-voting-due-date').val(moment(votingDueDate).format('MM/DD/YY hA'));

    modal.modal('show');
};

function commitEditRound() {
    var modal = $('#edit-round-modal');
    var editedId = modal.find('#edit-id').val();


    modal.modal('hide');
};

// Handle delete round modal on button click
function deleteRound() {
    var round = $(this).parent();
    var id = round.data('id');
    var name = round.data('name');

    var modal = $('#delete-round-modal');
    modal.find('#delete-id').val(id);
    modal.find('#delete-name').html(name);

    modal.modal('show');
};

function commitDeleteRound() {
    var modal = $('#delete-round-modal');
    var deletedId = modal.find('#delete-id').val();
    var deletedName = modal.find('#delete-name').html();
    var round = $('.round[data-id='+deletedId+']');
    round.html('<s>'+deletedName+'</s>');
    round.removeClass('current-round').addClass('deleted-round');
    modal.modal('hide');
};

// Bind all event handlers
$(document).ready(function() {
    $('form').submit(processFormSubmission);
    $('#send-email-btn').on('click', inviteMember);
    $('#add-round-btn').on('click', addRound);
    $('.edit-round-btn').on("click", editRound);
    $('#edit-round-btn').on("click", commitEditRound);
    $('.delete-round-btn').on("click", deleteRound);
    $('#delete-round-btn').on("click", commitDeleteRound);

    $('#the-basics').on('contentchanged', function() { $('#the-basics-save-warning').slideDown(); });
    $('#league-members').on('contentchanged', function() { $('#league-members-save-warning').slideDown(); });
    $('#league-rounds').on('contentchanged', function() { $('#league-rounds-save-warning').slideDown(); });
    $('#the-basics input').keydown(function() {
        if ( $(this).val() != $(this).data('og')) {
            $('#the-basics').trigger('contentchanged');
        }
    });
});
