package models;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ExpenseRecord extends Model<ExpenseRecord> {
    private int id;
    private int amount;
    private long phone;
    private String receiver;
    private String type;
    private String date;
    private String message;
    
    public ExpenseRecord () {
        this.table = "expense";
        this.primaryKey = "id";
    }

    public ExpenseRecord (int id, int amount, long phone, String receiver, String type, String date, String message) {
        this.table = "expense";
        this.primaryKey = "id";
        this.id = id;
        this.amount = amount;
        this.phone = phone;
        this.receiver = receiver;
        this.type = type;
        this.date = date;
        this.message = message;
    }

    @Override
    public ExpenseRecord toModel(ResultSet rs) {
        try {
            return new ExpenseRecord(
                rs.getInt("id"),
                rs.getInt("amount"),
                rs.getLong("phone"),
                rs.getString("receiver"),
                rs.getString("type"),
                rs.getString("date"),
                rs.getString("message")
            );
        } catch (SQLException e) {
            setMessage(e.getMessage());
            return null;
        }
    }
       
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public long getPhone() {
        return phone;
    }

    public void setPhone(long phone) {
        this.phone = phone;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
    
    public String getMessage(){
        return message;
    }
    
    public void setMessage(String message){
        this.message = message;
    }
}
